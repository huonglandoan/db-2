USE Fooddy;

-- Hàm tính doanh thu của một chi nhánh

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
    
    -- Khai báo các biến  
    DECLARE v_Food_ID INT;
    DECLARE v_Quantity INT;
    DECLARE v_Voucher_ID INT;
    DECLARE v_Unit_Price DECIMAL(10, 2);
    DECLARE v_Discount_Percent DECIMAL(5, 2);
    DECLARE v_Line_Revenue DECIMAL(15, 2); -- Doanh thu ròng tính được trên dòng
    
    DECLARE v_Branch_Exists INT DEFAULT 0;
    DECLARE v_done INT DEFAULT FALSE;

    DECLARE revenue_cursor CURSOR FOR 
        SELECT Food_ID, Quantity, Voucher_ID
        FROM Order_fooddy
        WHERE Branch_ID = p_Branch_ID
            AND Pick_up_status = 'Đã nhận'
            AND DATE(Order_time) BETWEEN p_Date_Start AND p_Date_End;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;

    SELECT COUNT(*) INTO v_Branch_Exists FROM Branch WHERE Branch_ID = p_Branch_ID;
    IF v_Branch_Exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Mã Chi nhánh không tồn tại.';
        RETURN NULL;
    END IF;

    IF p_Date_Start IS NULL OR p_Date_End IS NULL OR p_Date_Start > p_Date_End THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Ngày bắt đầu phải nhỏ hơn hoặc bằng Ngày kết thúc.';
        RETURN NULL;
    END IF;

    OPEN revenue_cursor;

    read_loop: LOOP
        FETCH revenue_cursor INTO v_Food_ID, v_Quantity, v_Voucher_ID;
        
        IF v_done THEN 
            LEAVE read_loop;
        END IF;

        SELECT Unit_price INTO v_Unit_Price
        FROM ServedFood
        WHERE Food_ID = v_Food_ID;

        SET v_Line_Revenue = v_Unit_Price * v_Quantity;
        
        IF v_Voucher_ID IS NOT NULL THEN
            
            SELECT Discount_value INTO v_Discount_Percent
            FROM Voucher
            WHERE Voucher_ID = v_Voucher_ID;
            
            SET v_Line_Revenue = v_Line_Revenue - (v_Line_Revenue * v_Discount_Percent / 100.0);
        END IF;

        SET v_Total_Revenue = v_Total_Revenue + v_Line_Revenue;

    END LOOP;

    CLOSE revenue_cursor;

    RETURN v_Total_Revenue;
END$$

DELIMITER ;

-- Hàm kiểm tra số lượng món ăn sắp hết

DELIMITER $$

DROP FUNCTION IF EXISTS Check_Low_Stock_Foods $$

CREATE FUNCTION Check_Low_Stock_Foods (
    p_Branch_ID INT,
    p_Threshold INT  
)
RETURNS VARCHAR(255)
DETERMINISTIC
BEGIN
    DECLARE v_Low_Stock_Count INT DEFAULT 0;
    DECLARE v_Food_ID INT;
    DECLARE v_Food_Quantity INT; 
    
    DECLARE v_Branch_Exists INT DEFAULT 0;
    DECLARE v_done INT DEFAULT FALSE;

    DECLARE food_cursor CURSOR FOR 
        SELECT sf.Food_ID, sf.Quantity
        FROM ServedFood sf
        JOIN Has_food hf ON sf.Food_ID = hf.Food_ID
        WHERE hf.Branch_ID = p_Branch_ID;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;

    SELECT COUNT(*) INTO v_Branch_Exists 
    FROM Branch 
    WHERE Branch_ID = p_Branch_ID;
    
    IF v_Branch_Exists = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Lỗi: Chi nhánh không tồn tại.';
        RETURN NULL;
    END IF;

    IF p_Threshold < 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Lỗi: Ngưỡng cảnh báo không được âm.';
        RETURN NULL;
    END IF;

    OPEN food_cursor;

    food_loop: LOOP
        FETCH food_cursor INTO v_Food_ID, v_Food_Quantity;
        
        IF v_done THEN
            LEAVE food_loop;
        END IF;

        IF v_Food_Quantity <= p_Threshold THEN
            SET v_Low_Stock_Count = v_Low_Stock_Count + 1;
        END IF;

    END LOOP;

    CLOSE food_cursor;

    IF v_Low_Stock_Count > 0 THEN
        RETURN CONCAT('CẢNH BÁO: Có ', v_Low_Stock_Count, ' món ăn sắp hết');
    ELSE
        RETURN CONCAT('TẤT CẢ món ăn tại chi nhánh ', p_Branch_ID, ' đều đạt ngưỡng tồn kho.');
    END IF;
END$$

DELIMITER ;

-- Một số lệnh test  
SELECT Calculate_Branch_Revenue(1, '2025-11-21', '2025-11-30') AS Total_Revenue_CN1;
-- Kết quả mong đợi: 175000.00 (90k gốc + 85k mới) 
SELECT Calculate_Branch_Revenue(2, '2025-11-20', '2025-11-30') AS Total_Revenue_CN2;
-- Kết quả mong đợi: 102000.00 (48k gốc + 54k mới)

SELECT Check_Low_Stock_Foods(1, 50) AS LowStock_Test_Warning;

SELECT Check_Low_Stock_Foods(1, 0) AS LowStock_Test_Count;

SELECT Check_Low_Stock_Foods(1, -10) AS Test_Error_Threshold;