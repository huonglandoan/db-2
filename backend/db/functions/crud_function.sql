DELIMITER $$

DROP PROCEDURE IF EXISTS Get_Foods_By_Branch $$
CREATE PROCEDURE Get_Foods_By_Branch(IN p_Branch_ID INT)
BEGIN
    SELECT sf.*
    FROM ServedFood sf
    INNER JOIN Has_food hf ON sf.Food_ID = hf.Food_ID
    WHERE hf.Branch_ID = p_Branch_ID;
END $$

DELIMITER ;


DELIMITER $$

DROP PROCEDURE IF EXISTS Add_Food $$
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
    -- Thêm món (Availability_status sẽ do trigger tự động set)
    INSERT INTO ServedFood (Food_name, Unit_price, Quantity, Image, Category)
    VALUES (p_Name, p_Price, p_Quantity, p_Image, p_Category);

    SET p_Food_ID = LAST_INSERT_ID();

    -- Gán món cho chi nhánh
    INSERT INTO Has_food (Food_ID, Branch_ID) VALUES (p_Food_ID, p_Branch_ID);
END $$

DELIMITER ;

DELIMITER $$

DROP PROCEDURE IF EXISTS Update_Food $$
CREATE PROCEDURE Update_Food(
    IN p_Food_ID INT,
    IN p_Name VARCHAR(255),
    IN p_Price DECIMAL(10,2),
    IN p_Quantity INT,
    IN p_Image VARCHAR(255),
    IN p_Category VARCHAR(50)
)
BEGIN
    -- Cập nhật món ăn
    UPDATE ServedFood
    SET 
        Food_name = p_Name,
        Unit_price = p_Price,
        Quantity = p_Quantity,
        Image = p_Image,
        Category = p_Category,
        -- Cập nhật trạng thái dựa vào Quantity
        Availability_status = CASE 
            WHEN p_Quantity > 0 THEN 'Còn hàng' 
            ELSE 'Hết hàng' 
        END
    WHERE Food_ID = p_Food_ID;
END $$

DELIMITER ;
