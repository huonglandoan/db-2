USE Fooddy;

-- Stored Procedure 1: Get foods by branch
DROP PROCEDURE IF EXISTS GetFoodsByBranch;
DELIMITER $$

CREATE PROCEDURE GetFoodsByBranch(
    IN p_Branch_ID INT
)
BEGIN
    SELECT 
        sf.Food_ID,
        sf.Food_name,
        sf.Unit_price,
        sf.Availability_status,
        sf.Quantity,
        sf.Category
    FROM ServedFood sf
    INNER JOIN Has_food hf ON sf.Food_ID = hf.Food_ID
    WHERE hf.Branch_ID = p_Branch_ID
    ORDER BY sf.Food_name ASC;
END$$

DELIMITER ;

-- Example call:
-- CALL GetFoodsByBranch(1);


-- Stored Procedure 2: Top selling foods
DROP PROCEDURE IF EXISTS GetTopSellingFoods;
DELIMITER $$

CREATE PROCEDURE GetTopSellingFoods(
    IN p_Branch_ID INT
)
BEGIN
    SELECT 
        sf.Food_ID,
        sf.Food_name,
        SUM(o.Quantity) AS Total_Sold
    FROM Order_fooddy o
    INNER JOIN ServedFood sf ON o.Food_ID = sf.Food_ID
    WHERE o.Branch_ID = p_Branch_ID
    GROUP BY sf.Food_ID, sf.Food_name
    HAVING SUM(o.Quantity) > 1
    ORDER BY Total_Sold DESC;
END$$

DELIMITER ;

-- Example call:
-- CALL GetTopSellingFoods(1);
