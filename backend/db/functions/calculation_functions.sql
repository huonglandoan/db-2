USE Fooddy;

DELIMITER $$

DROP FUNCTION IF EXISTS Calculate_Branch_Revenue $$

CREATE FUNCTION Calculate_Branch_Revenue (
    p_Branch_ID INT, 
    p_Date_Start DATE,
    p_Date_End DATE
)
RETURNS DECIMAL(15, 2)
DETERMINISTIC
BEGIN
    DECLARE v_Total_Revenue DECIMAL(15, 2) DEFAULT 0.00;
    DECLARE v_Order_Price DECIMAL(10, 2);
    DECLARE v_Branch_Exists INT DEFAULT 0;
    DECLARE v_done INT DEFAULT FALSE;

    -- Cursor
    DECLARE revenue_cursor CURSOR FOR 
        SELECT Price
        FROM Order_fooddy
        WHERE Branch_ID = p_Branch_ID
          AND Pick_up_status = 'Đã nhận'
          AND DATE(Order_time) BETWEEN p_Date_Start AND p_Date_End;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;

    -- Validate chi nhánh
    SELECT COUNT(*) INTO v_Branch_Exists 
    FROM Branch 
    WHERE Branch_ID = p_Branch_ID;

    IF v_Branch_Exists = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Lỗi: Mã Chi nhánh không tồn tại.';
        RETURN NULL;
    END IF;

    -- Validate ngày
    IF p_Date_Start IS NULL 
       OR p_Date_End IS NULL 
       OR p_Date_Start > p_Date_End THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Lỗi: Ngày bắt đầu phải nhỏ hơn hoặc bằng Ngày kết thúc.';
        RETURN NULL;
    END IF;

    OPEN revenue_cursor;

    read_loop: LOOP
        FETCH revenue_cursor INTO v_Order_Price;
        IF v_done THEN 
            LEAVE read_loop;
        END IF;

        SET v_Total_Revenue = v_Total_Revenue + v_Order_Price;
    END LOOP;

    CLOSE revenue_cursor;

    RETURN v_Total_Revenue;
END$$

DELIMITER ;

DELIMITER $$

DROP FUNCTION IF EXISTS Calculate_Branch_Discount_Expense $$

CREATE FUNCTION Calculate_Branch_Discount_Expense (
    p_Branch_ID INT,
    p_Start_Date DATE,
    p_End_Date DATE
)
RETURNS DECIMAL(15, 2)
DETERMINISTIC
BEGIN
    DECLARE v_Total_Discount_Expense DECIMAL(15, 2) DEFAULT 0.00;
    DECLARE v_Food_ID INT;
    DECLARE v_Quantity INT;
    DECLARE v_Voucher_ID INT;
    DECLARE v_Unit_Price DECIMAL(10, 2);
    DECLARE v_Discount_Percent DECIMAL(5, 2);

    DECLARE v_Branch_Exists INT DEFAULT 0;
    DECLARE v_done INT DEFAULT FALSE;

    -- Cursor
    DECLARE order_line_cursor CURSOR FOR
        SELECT OFD.Food_ID, OFD.Quantity, OFD.Voucher_ID
        FROM Order_fooddy OFD
        WHERE OFD.Branch_ID = p_Branch_ID
          AND OFD.Pick_up_status = 'Đã nhận'
          AND DATE(OFD.Order_time) BETWEEN p_Start_Date AND p_End_Date;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;

    -- Validate chi nhánh
    SELECT COUNT(*) INTO v_Branch_Exists 
    FROM Branch 
    WHERE Branch_ID = p_Branch_ID;

    IF v_Branch_Exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Lỗi: Mã Chi nhánh không tồn tại.';
        RETURN NULL;
    END IF;

    -- Validate ngày
    IF p_Start_Date IS NULL 
       OR p_End_Date IS NULL 
       OR p_Start_Date > p_End_Date THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Lỗi: Ngày bắt đầu phải nhỏ hơn hoặc bằng Ngày kết thúc.';
        RETURN NULL;
    END IF;

    OPEN order_line_cursor;

    read_loop: LOOP
        FETCH order_line_cursor INTO v_Food_ID, v_Quantity, v_Voucher_ID;

        IF v_done THEN
            LEAVE read_loop;
        END IF;

        -- Lấy giá món ăn (thêm LIMIT để tránh NOT FOUND trigger)
        SELECT Unit_price 
        INTO v_Unit_Price
        FROM ServedFood
        WHERE Food_ID = v_Food_ID
        LIMIT 1;

        -- Nếu có dùng voucher
        IF v_Voucher_ID IS NOT NULL THEN
            SELECT Discount_value 
            INTO v_Discount_Percent
            FROM Voucher
            WHERE Voucher_ID = v_Voucher_ID
            LIMIT 1;

            SET v_Total_Discount_Expense = v_Total_Discount_Expense 
                + (v_Unit_Price * v_Quantity * v_Discount_Percent / 100.0);
        END IF;

    END LOOP;

    CLOSE order_line_cursor;

    RETURN v_Total_Discount_Expense;
END$$

DELIMITER ;

-- Test các function nhé 
-- 4a. TEST HÀM TÍNH CHI PHÍ GIẢM GIÁ (Branch 1, 21/11-30/11)
-- Kết quả mong đợi: 10,000.00 VND
SELECT '--- Kiem tra Ham Chi Phi Giam Gia (Voucher) ---' AS Test;
SELECT Calculate_Branch_Discount_Expense(1, '2025-11-21', '2025-11-30') AS Expense_Test_CN1;

-- 4b. TEST HÀM TÍNH DOANH THU (Branch 1, 21/11-30/11)
-- Kết quả mong đợi: 90,000.00 VND (Chỉ tính Order 11)
SELECT '--- Kiem tra Ham Doanh Thu ---' AS Test;
SELECT Calculate_Branch_Revenue(1, '2025-11-21', '2025-11-30') AS Revenue_Test_CN1;

-- 4c. KIỂM TRA RÀNG BUỘC NGÀY THÁNG LỖI (Sẽ trả về NULL)
SELECT '--- Kiem tra Rang Buoc Ngay Thang ---' AS Test;
SELECT Calculate_Branch_Revenue(1, '2025-12-01', '2025-11-01') AS Test_Date_Error;