DROP DATABASE fooddy;
CREATE DATABASE Fooddy;
USE Fooddy;


-- Bảng chi nhánh
CREATE TABLE Branch (
    Branch_ID INT AUTO_INCREMENT PRIMARY KEY,
    Address VARCHAR(255) NOT NULL,
    Contact_number VARCHAR(10) NOT NULL
        CHECK (Contact_number REGEXP '^[0-9]{10}$'),
    Opening_hours VARCHAR(100) NOT NULL,
    Branch_status ENUM('Hoạt động', 'Tạm ngưng', 'Đóng cửa') NOT NULL,
    Manager_ID_number CHAR(12),
    Manager_start_date DATE
);


-- Bảng người dùng
CREATE TABLE User_fooddy (
    ID_number CHAR(12) PRIMARY KEY
        CHECK (ID_number REGEXP '^[0-9]{12}$'),
    Full_name VARCHAR(100) NOT NULL,
    Date_of_birth DATE NOT NULL,
    Unit VARCHAR(100) NOT NULL,
    Email VARCHAR(100) CHECK (Email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') NOT NULL UNIQUE,
    Position_fooddy VARCHAR(50),
    Phone_number VARCHAR(10) NOT NULL UNIQUE
        CHECK (Phone_number REGEXP '^[0-9]{10}$'),
    Registration_day DATE NOT NULL,
	Account_status ENUM('Bình thường', 'Tạm ngưng', 'Khóa')
        DEFAULT 'Bình thường'
);


-- Bảng khách hàng
CREATE TABLE Customer (
    ID_number CHAR(12) PRIMARY KEY,
    FOREIGN KEY (ID_number) REFERENCES User_fooddy(ID_number)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- Bảng nhân viên
CREATE TABLE Staff (
    ID_number CHAR(12) PRIMARY KEY,
    Salary DECIMAL(10,2) NOT NULL
        CHECK (Salary >= 0),
    Hire_date DATE NOT NULL,
    Branch_ID INT NOT NULL,
    Supervisior_ID_number CHAR(12),
    FOREIGN KEY (Supervisior_ID_number) REFERENCES Staff(ID_number)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (ID_number) REFERENCES User_fooddy(ID_number)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);


ALTER TABLE Branch
    ADD FOREIGN KEY (Manager_ID_number) REFERENCES Staff(ID_number)         
        ON DELETE SET NULL
        ON UPDATE CASCADE;


CREATE TABLE Shift_type(
	Shift ENUM('Sáng', 'Chiều') ,
    ID_number CHAR(12) ,
    PRIMARY KEY(Shift, ID_number),
    FOREIGN KEY (ID_number) REFERENCES Staff(ID_number)
);


-- Bảng ví
CREATE TABLE Wallet (
    Wallet_ID CHAR(8) PRIMARY KEY DEFAULT (LEFT(UUID(), 8)),
    Customer_ID_number CHAR(12) NOT NULL,
    Balance DECIMAL(10,2) NOT NULL
        CHECK (Balance >= 0),
    Last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Customer_ID_number) REFERENCES Customer(ID_number)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- Bảng thanh toán
CREATE TABLE Payment (
    Payment_ID CHAR(8) PRIMARY KEY DEFAULT (LEFT(UUID(), 8)),
    Wallet_ID CHAR(8) NOT NULL,
    Payment_type ENUM('Nạp tiền', 'Chuyển tiền nội bộ', 'Thanh toán món ăn') NOT NULL,
        -- Nạp tiền, Chuyển tiền nội bộ, Thanh toán món ăn
    Method ENUM('Banking', 'Ví điện tử', 'VietQR') NOT NULL,
        -- ATM/Banking, Ví điện tử, VietQR
    Time_stamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Status_fooddy ENUM('Thành công', 'Thất bại', 'Đang xử lý') NOT NULL,
        -- Thành công, Thất bại, Đang xử lý
    Amount DECIMAL(10,2) NOT NULL
        CHECK (Amount >= 0),
    FOREIGN KEY (Wallet_ID) REFERENCES Wallet(Wallet_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- Bảng voucher
CREATE TABLE Voucher (
    Voucher_ID CHAR(8) PRIMARY KEY DEFAULT (LEFT(UUID(), 8)),
    Description_voucher VARCHAR(255) NOT NULL,
    Branch_ID INT NOT NULL,
    Discount_value DECIMAL(5,2) NOT NULL
        CHECK (Discount_value >= 0 AND Discount_value <= 50),
    Status_voucher ENUM('Còn hiệu lực', 'Hết hạn', 'Ngừng phát hành') NOT NULL,
        -- Còn hiệu lực, Hết hạn, Ngừng phát hành
    Date_start DATE NOT NULL,
    Date_end DATE NOT NULL,
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- Bảng món ăn phục vụ
CREATE TABLE ServedFood (
    Food_ID INT PRIMARY KEY AUTO_INCREMENT,
    Food_name VARCHAR(100) NOT NULL,
    Unit_price DECIMAL(10,2) NOT NULL CHECK (Unit_price >= 0),
    Availability_status ENUM('Còn hàng', 'Hết hàng', 'Ngừng bán')
        DEFAULT 'Còn hàng',
    Image VARCHAR(255),
    Quantity INT NOT NULL DEFAULT 0 CHECK (Quantity >= 0),
    Category VARCHAR(50) NOT NULL
);


-- Bảng transaction log
CREATE TABLE Transaction_log (
    Log_ID INT PRIMARY KEY AUTO_INCREMENT,
    Staff_ID_number CHAR(12) NOT NULL
        CHECK (Staff_ID_number REGEXP '^[0-9]{12}$'),
    Action_time DATETIME NOT NULL,
    FOREIGN KEY (Staff_ID_number) REFERENCES Staff(ID_number)
);


-- Bảng order
CREATE TABLE Order_fooddy (
    Order_ID CHAR(8) PRIMARY KEY DEFAULT (LEFT(UUID(), 8)),
    Customer_ID_number CHAR(12) NOT NULL,
    Food_ID INT NOT NULL,
    Log_ID INT NOT NULL,
    Payment_ID CHAR(8) NOT NULL,
    Branch_ID INT NOT NULL,
    Pick_up_status ENUM('Chưa nhận', 'Đã nhận', 'Đã hủy')
		NOT NULL DEFAULT 'Chưa nhận',
    QR_code VARCHAR(255),
    Price DECIMAL(10,2) NOT NULL
        CHECK (Price >= 0),
    Quantity INT NOT NULL
        CHECK (Quantity > 0),
    Voucher_ID CHAR(8),
    Order_time DATETIME NOT NULL,
    FOREIGN KEY (Food_ID) REFERENCES ServedFood(Food_ID),
    FOREIGN KEY (Customer_ID_number) REFERENCES Customer(ID_number),
    FOREIGN KEY (Payment_ID) REFERENCES Payment(Payment_ID),
    FOREIGN KEY (Voucher_ID) REFERENCES Voucher(Voucher_ID),
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID),
    FOREIGN KEY (Log_ID) REFERENCES Transaction_log(Log_ID)
);


-- Bảng thành phần nguyên liệu
CREATE TABLE Ingredient (
    Ingredient_ID INT PRIMARY KEY AUTO_INCREMENT,
    Ingredient_name VARCHAR(100) NOT NULL,
    Quantity INT CHECK (Quantity >= 0) NOT NULL,
    Description_fooddy VARCHAR(255) NOT NULL,
    Unit VARCHAR(50) NOT NULL
);


-- Bảng công ty cung cấp
CREATE TABLE Company (
    Company_ID INT PRIMARY KEY AUTO_INCREMENT,
    Company_name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) CHECK (Email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') NOT NULL,
    Phone_number VARCHAR(20) CHECK (Phone_number REGEXP '^[0-9]{9,11}$') NOT NULL
);


-- Bảng batch (lô hàng)
CREATE TABLE Batch (
    Batch_ID INT PRIMARY KEY AUTO_INCREMENT,
    Production_date DATE NOT NULL,
    Batch_name VARCHAR(100),
    Quantity INT CHECK (Quantity >= 0) NOT NULL,
    Recived_date DATE NOT NULL,
    Cost DECIMAL(10,2) CHECK (Cost >= 0) NOT NULL,
    Delivery_date DATE NOT NULL,
    Company_ID INT NOT NULL,
    Branch_ID INT NOT NULL,
    FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID),
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- Bảng Contain (thành phần trong batch)
CREATE TABLE Contain (
    Ingredient_ID INT,
    Batch_ID INT,
    PRIMARY KEY (Ingredient_ID, Batch_ID),
    FOREIGN KEY (Ingredient_ID) REFERENCES Ingredient(Ingredient_ID),
    FOREIGN KEY (Batch_ID) REFERENCES Batch(Batch_ID)
);


-- Bảng menu
CREATE TABLE Menu (
    Branch_ID INT,
    Shift ENUM('Sáng', 'Chiều') NOT NULL,
    Date_menu DATE NOT NULL,
    PRIMARY KEY (Branch_ID, Shift, Date_menu),
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- Bảng Has (chi nhánh có món ăn)
CREATE TABLE Has (
    Food_ID INT NOT NULL,
    Branch_ID INT NOT NULL,
	Shift ENUM('Sáng', 'Chiều') NOT NULL,
    Date_menu DATE NOT NULL,
    PRIMARY KEY (Food_ID, Branch_ID,Shift,Date_menu),
    FOREIGN KEY (Food_ID) REFERENCES ServedFood(Food_ID),
    FOREIGN KEY (Branch_ID,Shift,Date_menu) REFERENCES Menu(Branch_ID,Shift,Date_menu)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE Has_food(
    Food_ID INT NOT NULL,
    Branch_ID INT NOT NULL,
    PRIMARY KEY (Food_ID, Branch_ID),
        FOREIGN KEY (Food_ID) REFERENCES ServedFood(Food_ID),
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE

);
DELIMITER $$


CREATE TRIGGER trg_payment_before_insert
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
    DECLARE wallet_balance DECIMAL(10,2);

    IF NEW.Payment_type = 'Thanh toán món ăn' THEN
        SELECT Balance INTO wallet_balance
        FROM Wallet
        WHERE Wallet_ID = NEW.Wallet_ID;

        IF wallet_balance IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không tìm thấy ví.';
        END IF;

        IF wallet_balance < NEW.Amount THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Thanh toán không thành công. Số dư ví không đủ.';
        END IF;
    END IF;
END$$


CREATE TRIGGER trg_payment_before_update
BEFORE UPDATE ON Payment
FOR EACH ROW
BEGIN
	DECLARE wallet_balance DECIMAL(10,2);
    IF NEW.Payment_type = 'Thanh toán món ăn' THEN


        SELECT Balance INTO wallet_balance
        FROM Wallet
        WHERE Wallet_ID = NEW.Wallet_ID;

        IF wallet_balance IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không tìm thấy ví.';
        END IF;

        IF wallet_balance < NEW.Amount THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Thanh toán không thành công. Số dư ví không đủ.';
        END IF;
    END IF;
END$$


CREATE TRIGGER trg_deposit_limit
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
    -- Chỉ áp dụng cho giao dịch nạp tiền
    IF NEW.Payment_type = 'Nạp tiền' THEN
        IF NEW.Amount < 50000 OR NEW.Amount > 5000000 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Số tiền nạp vào phải từ 50000 đến 5000000 VND.';
        END IF;
    END IF;
END$$


CREATE TRIGGER trg_internal_transfer_limit
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
    -- Khai báo biến phải nằm ở đầu BEGIN
    DECLARE transfer_count INT;

    -- Chỉ áp dụng cho giao dịch chuyển tiền nội bộ
    IF NEW.Payment_type = 'Chuyển tiền nội bộ' THEN

        -- Kiểm tra số tiền hợp lệ
        IF NEW.Amount < 10000 OR NEW.Amount > 2000000 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Số tiền chuyển đi phải từ 10000 đến 2000000 VND.';
        END IF;

        -- Kiểm tra số lần giao dịch trong ngày
        SELECT COUNT(*) INTO transfer_count
        FROM Payment
        WHERE Wallet_ID = NEW.Wallet_ID
          AND Payment_type = 'Chuyển tiền nội bộ'
          AND DATE(Time_stamp) = DATE(NEW.Time_stamp);

        IF transfer_count >= 5 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Đã vượt quá hạn mức 5 lần chuyển tiền trên 1 ngày.';
        END IF;

    END IF;
END$$


CREATE TRIGGER trg_order_before_insert
BEFORE INSERT ON Order_fooddy
FOR EACH ROW
BEGIN
    DECLARE v_food_status VARCHAR(50);
    DECLARE v_branch_status VARCHAR(50);

    SELECT Availability_status INTO v_food_status
    FROM ServedFood
    WHERE Food_ID = NEW.Food_ID;

    IF v_food_status = 'Hết hàng' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể tạo đơn hàng. Đã hết sản phẩm đã chọn.';
    END IF;

    SELECT Branch_status INTO v_branch_status
    FROM Branch
    WHERE Branch_ID = NEW.Branch_ID;

    IF v_branch_status IN ('Tạm ngưng', 'Đóng cửa') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể tạo đơn hàng. Chi nhánh đã chọn không hoạt động hoặc đã đóng cửa.';
    END IF;
END$$


CREATE TRIGGER trg_order_quantity_limit
BEFORE INSERT ON Order_fooddy
FOR EACH ROW
BEGIN
    IF NEW.Quantity > 20 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể tạo đơn hàng. Số lượng của một món ăn không thể vượt quá 20.';
    END IF;
END$$


CREATE TRIGGER trg_voucher_duration_insert
BEFORE INSERT ON Voucher
FOR EACH ROW
BEGIN
    IF DATEDIFF(NEW.Date_end, NEW.Date_start) > 30 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Thời hạn của voucher không thể vượt quá 30 ngày.';
    END IF;
END$$


-- Trigger trước khi cập nhật voucher
CREATE TRIGGER trg_voucher_duration_update
BEFORE UPDATE ON Voucher
FOR EACH ROW
BEGIN
    IF DATEDIFF(NEW.Date_end, NEW.Date_start) > 30 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Thời hạn của voucher không thể vượt quá 30 ngày.';
    END IF;
END$$


CREATE TRIGGER trg_shift_unique
BEFORE INSERT ON Shift_type
FOR EACH ROW
BEGIN
    -- Kiểm tra nhân viên đã có ca làm việc cùng ca, cùng ngày hay chưa
    IF EXISTS (
        SELECT 1
        FROM Shift_type s
        WHERE s.ID_number = NEW.ID_number
        AND s.Shift = NEW.Shift
        -- Giả sử bảng Shift_type chỉ lưu ca, không lưu ngày; nếu có ngày thì thêm điều kiện ngày
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Nhân viên chỉ có thể có một ca làm tại một chi nhánh tại một thời điểm cụ thể.';
    END IF;
END$$


CREATE TRIGGER trg_manager_startdate
BEFORE INSERT ON Staff
FOR EACH ROW
BEGIN
    DECLARE reg_date DATE;

    -- Lấy ngày đăng ký của nhân viên từ User_fooddy
    SELECT Registration_day INTO reg_date
    FROM User_fooddy
    WHERE ID_number = NEW.ID_number;

    IF NEW.Hire_date < reg_date THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Ngày bắt đầu làm quản lý phải lớn hơn hoặc bằng ngày được nhận vào làm.';
    END IF;
END$$


CREATE TRIGGER trg_check_staff_age
BEFORE INSERT ON Staff
FOR EACH ROW
BEGIN
    DECLARE dob DATE;
    DECLARE age INT;

    -- Lấy ngày sinh của nhân viên từ User_fooddy
    SELECT Date_of_birth INTO dob
    FROM User_fooddy
    WHERE ID_number = NEW.ID_number;

    -- Tính tuổi dựa trên ngày hiện tại
    SET age = TIMESTAMPDIFF(YEAR, dob, CURDATE());

    IF age < 18 OR age > 60 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Tuổi của nhân viên phải từ 18 đến 60 tuổi.';
    END IF;
END$$


CREATE TRIGGER trg_update_balance_after_payment
AFTER INSERT ON Payment
FOR EACH ROW
BEGIN

    IF NEW.Payment_type = 'Nạp tiền' AND NEW.Status_fooddy = 'Thành công' THEN
        UPDATE Wallet
        SET Balance = Balance + NEW.Amount,
            Last_updated = NOW()
        WHERE Wallet_ID = NEW.Wallet_ID;
    ELSEIF (NEW.Payment_type = 'Thanh toán món ăn' OR NEW.Payment_type = 'Chuyển tiền nội bộ') 
           AND NEW.Status_fooddy IN ('Thành công', 'Đang xử lý') THEN

        UPDATE Wallet
        SET Balance = Balance - NEW.Amount,
            Last_updated = NOW()
        WHERE Wallet_ID = NEW.Wallet_ID;
    END IF;
END$$

CREATE TRIGGER trg_restore_balance_after_payment_update
AFTER UPDATE ON Payment
FOR EACH ROW
BEGIN

    IF (NEW.Payment_type IN ('Thanh toán món ăn', 'Chuyển tiền nội bộ')) 
       AND (OLD.Status_fooddy IN ('Thành công', 'Đang xử lý')) 
       AND (NEW.Status_fooddy = 'Thất bại') THEN

        UPDATE Wallet
        SET Balance = Balance + OLD.Amount,
            Last_updated = NOW()
        WHERE Wallet_ID = NEW.Wallet_ID;
    END IF;
    IF (NEW.Payment_type = 'Nạp tiền')
       AND (OLD.Status_fooddy = 'Thành công')
       AND (NEW.Status_fooddy = 'Thất bại') THEN

        UPDATE Wallet
        SET Balance = Balance - OLD.Amount,
            Last_updated = NOW()
        WHERE Wallet_ID = NEW.Wallet_ID;
    END IF;
    IF (NEW.Payment_type IN ('Thanh toán món ăn', 'Chuyển tiền nội bộ'))
       AND (NEW.Status_fooddy IN ('Thành công', 'Đang xử lý'))
       AND (NEW.Amount <> OLD.Amount) THEN
       UPDATE Wallet
       SET Balance = Balance - (NEW.Amount - OLD.Amount),
           Last_updated = NOW()
       WHERE Wallet_ID = NEW.Wallet_ID;
    END IF;
END$$

DELIMITER ;