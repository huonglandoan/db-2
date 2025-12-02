USE Fooddy;

DROP PROCEDURE IF EXISTS Get_Foods;

DELIMITER $$
CREATE PROCEDURE Get_Foods(
    IN p_Branch_ID INT
)
BEGIN
    SELECT 
        sf.Food_ID,
        sf.Food_name,
        sf.Unit_price,
        sf.Quantity,
        sf.Availability_status,
        sf.Category,
        sf.Image
    FROM ServedFood sf
    INNER JOIN Has_food hf ON sf.Food_ID = hf.Food_ID
    WHERE hf.Branch_ID = p_Branch_ID
    ORDER BY sf.Food_name ASC;
END$$
DELIMITER ;

-- Procedure validateFood: dùng chung cho insert/update
DROP PROCEDURE IF EXISTS validateFood;
DELIMITER $$
CREATE PROCEDURE validateFood(
    IN p_Name VARCHAR(255),
    IN p_Price DECIMAL(10,2),
    IN p_Quantity INT,
    IN p_Category VARCHAR(50)
)
BEGIN
    -- Validate tên món
    IF p_Name IS NULL OR TRIM(p_Name) = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tên món ăn không được để trống';
    END IF;

    -- Validate giá
    IF p_Price < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Giá món ăn phải >= 0';
    END IF;

    -- Validate số lượng
    IF p_Quantity < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số lượng phải >= 0';
    END IF;

    -- Validate category
    IF p_Category IS NULL OR TRIM(p_Category) = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Danh mục món ăn không được để trống';
    END IF;
END$$
DELIMITER ;

-- Procedure Add_Food: rely trigger để validate
DROP PROCEDURE IF EXISTS Add_Food;
DELIMITER $$
CREATE PROCEDURE Add_Food(
    IN p_Name VARCHAR(255),
    IN p_Price DECIMAL(10,2),
    IN p_Image VARCHAR(255),
    IN p_Quantity INT,
    IN p_Category VARCHAR(50),
    IN p_Branch_ID INT,
    OUT p_Food_ID INT
)
BEGIN
    -- Thêm món ăn
    INSERT INTO ServedFood (
        Food_name, Unit_price, Quantity, Image, Category, Availability_status
    )
    VALUES (
        p_Name,
        p_Price,
        p_Quantity,
        p_Image,
        p_Category,
        CASE WHEN p_Quantity > 0 THEN 'Còn hàng' ELSE 'Hết hàng' END
    );

    SET p_Food_ID = LAST_INSERT_ID();

    INSERT INTO Has_food (Food_ID, Branch_ID)
    VALUES (p_Food_ID, p_Branch_ID);
END$$
DELIMITER ;

-- Procedure Update_Food: rely trigger để validate
DROP PROCEDURE IF EXISTS Update_Food;
DELIMITER $$
CREATE PROCEDURE Update_Food(
    IN p_Food_ID INT,
    IN p_Name VARCHAR(255),
    IN p_Price DECIMAL(10,2),
    IN p_Quantity INT,
    IN p_Image VARCHAR(255),
    IN p_Category VARCHAR(50)
)
BEGIN
    UPDATE ServedFood
    SET 
        Food_name = p_Name,
        Unit_price = p_Price,
        Quantity = p_Quantity,
        Image = p_Image,
        Category = p_Category,
        Availability_status = CASE 
            WHEN p_Quantity > 0 THEN 'Còn hàng'
            ELSE 'Hết hàng'
        END
    WHERE Food_ID = p_Food_ID;
END$$
DELIMITER ;

-- Trigger BEFORE INSERT: gọi validateFood
DROP TRIGGER IF EXISTS check_food_before_insert;
DELIMITER $$
CREATE TRIGGER check_food_before_insert
BEFORE INSERT ON ServedFood
FOR EACH ROW
BEGIN
    CALL validateFood(NEW.Food_name, NEW.Unit_price, NEW.Quantity, NEW.Category);
END$$
DELIMITER ;

-- Trigger BEFORE UPDATE: gọi validateFood
DROP TRIGGER IF EXISTS check_food_before_update;
DELIMITER $$
CREATE TRIGGER check_food_before_update
BEFORE UPDATE ON ServedFood
FOR EACH ROW
BEGIN
    CALL validateFood(NEW.Food_name, NEW.Unit_price, NEW.Quantity, NEW.Category);
END$$

DROP PROCEDURE IF EXISTS Delete_Food;

CREATE PROCEDURE Delete_Food(
    IN p_Food_ID INT
)
BEGIN
    -- Kiểm tra tồn tại
    IF NOT EXISTS (
        SELECT 1 FROM ServedFood WHERE Food_ID = p_Food_ID
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Món ăn không tồn tại';
    END IF;

    -- 1. Xóa order liên quan
    DELETE FROM Order_fooddy
    WHERE Food_ID = p_Food_ID;

    -- 2. Xóa menu (Has)
    DELETE FROM Has
    WHERE Food_ID = p_Food_ID;

    -- 3. Xóa bảng chi nhánh có món
    DELETE FROM Has_food
    WHERE Food_ID = p_Food_ID;

    -- 4. Xóa món ăn
    DELETE FROM ServedFood
    WHERE Food_ID = p_Food_ID;
END$$


DELIMITER ;
