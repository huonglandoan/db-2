USE Fooddy;
DROP PROCEDURE IF EXISTS Get_Foods_available;
DELIMITER $$
CREATE PROCEDURE Get_Foods_available(IN p_Branch_ID INT)
BEGIN
    SELECT sf.Food_ID, sf.Food_name, sf.Unit_price, sf.Quantity, sf.Availability_status, sf.Category, sf.Image
    FROM ServedFood sf
    INNER JOIN Has_food hf ON sf.Food_ID = hf.Food_ID
    WHERE hf.Branch_ID = p_Branch_ID
    AND sf.Quantity > 0
    AND sf.Availability_status = 'Còn hàng'
    ORDER BY sf.Food_name ASC;
END$$
DELIMITER ;

-- Drop nếu đã tồn tại
DROP PROCEDURE IF EXISTS Get_Menu_Items;

DELIMITER $$
CREATE PROCEDURE Get_Menu_Items(
    IN p_Branch_ID INT,
    IN p_Date_menu DATE,
    IN p_Shift VARCHAR(50)
)
BEGIN
    SELECT 
      h.Food_ID,
      f.Food_name,
      f.Unit_price,
      f.Availability_status,
      f.Image,
      f.Quantity,
      f.Category
    FROM Has h
    JOIN ServedFood f ON h.Food_ID = f.Food_ID
    WHERE h.Branch_ID = p_Branch_ID 
      AND h.Date_menu = p_Date_menu
      AND h.Shift = p_Shift
    ORDER BY f.Food_name;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS Manage_Menu_Base;
DELIMITER $$
CREATE PROCEDURE Manage_Menu_Base(
    IN p_Branch_ID INT,
    IN p_Shift ENUM('Sáng', 'Chiều'),
    IN p_Date_menu DATE
)
BEGIN
    -- 1. Kiểm tra và tạo bản ghi Menu nếu chưa tồn tại (UPSERT)
    -- Lệnh INSERT IGNORE sử dụng PRIMARY KEY (Branch_ID, Shift, Date_menu)
    -- để đảm bảo chỉ chèn khi không có bản ghi nào trùng lặp.
    INSERT IGNORE INTO Menu (Branch_ID, Shift, Date_menu) 
    VALUES (p_Branch_ID, p_Shift, p_Date_menu);

    -- 2. Xóa tất cả các món ăn cũ đã được gán (trong bảng Has)
    DELETE FROM Has 
    WHERE Branch_ID = p_Branch_ID 
      AND Shift = p_Shift 
      AND Date_menu = p_Date_menu;
      
    -- LƯU Ý: Không sử dụng START TRANSACTION hoặc COMMIT/ROLLBACK ở đây 
    -- vì chúng ta sẽ quản lý giao dịch ở phía Node.js để chèn các món ăn mới sau đó.

END$$
DELIMITER ;

-- Drop nếu đã tồn tại
DROP PROCEDURE IF EXISTS Get_All_Branch_Menus;

DELIMITER $$
CREATE PROCEDURE Get_All_Branch_Menus(
    IN p_Branch_ID INT
)
BEGIN
    SELECT 
      m.Branch_ID,
      m.Shift,
      m.Date_menu,
      h.Food_ID,
      f.Food_name,
      f.Unit_price,
      f.Availability_status,
      f.Image,
      f.Category
    FROM Menu m
    -- LEFT JOIN với Has để hiển thị Menu ngay cả khi chưa có món ăn
    LEFT JOIN Has h
      ON m.Branch_ID = h.Branch_ID
      AND m.Shift = h.Shift
      AND m.Date_menu = h.Date_menu
    -- LEFT JOIN với ServedFood để lấy chi tiết món ăn
    LEFT JOIN ServedFood f
      ON h.Food_ID = f.Food_ID
    WHERE m.Branch_ID = p_Branch_ID
    -- Sắp xếp theo ngày mới nhất trước, sau đó là Ca và ID món ăn
    ORDER BY m.Date_menu DESC, m.Shift, h.Food_ID;
END$$
DELIMITER ;

-- Drop nếu đã tồn tại
DROP PROCEDURE IF EXISTS Get_Menu_Items_Detail;

DELIMITER $$
CREATE PROCEDURE Get_Menu_Items_Detail(
    IN p_Branch_ID INT,
    IN p_Date_menu DATE,
    IN p_Shift ENUM('Sáng', 'Chiều')
)
BEGIN
    SELECT 
      h.Food_ID,
      f.Food_name,
      f.Unit_price,
      f.Availability_status,
      f.Image,
      f.Quantity,
      f.Category
    -- Chỉ cần JOIN Has và ServedFood
    FROM Has h
    JOIN ServedFood f ON h.Food_ID = f.Food_ID
    WHERE h.Branch_ID = p_Branch_ID 
      AND h.Date_menu = p_Date_menu
      AND h.Shift = p_Shift
    ORDER BY f.Food_name;
END$$
DELIMITER ;