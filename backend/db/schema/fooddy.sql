DROP DATABASE fooddy;
CREATE DATABASE Fooddy;
USE Fooddy;

-- Bảng chi nhánh
CREATE TABLE Branch (
    Branch_ID INT PRIMARY KEY,
    Address VARCHAR(255) NOT NULL,
    Contact_number VARCHAR(10) NOT NULL
        CHECK (Contact_number REGEXP '^[0-9]{10}$'),
    Opening_hours VARCHAR(100) NOT NULL,
    Branch_status ENUM('Active', 'Inactive', 'Closed') NOT NULL,
    Manager_ID_number CHAR(12) ,
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
    Wallet_ID CHAR(8) PRIMARY KEY
        CHECK (Wallet_ID REGEXP '^[0-9]{8}$'),
    Customer_ID_number CHAR(12) NOT NULL,
    Balance DECIMAL(10,2) NOT NULL
        CHECK (Balance >= 0),
    Last_updated DATETIME NOT NULL,
    FOREIGN KEY (Customer_ID_number) REFERENCES Customer(ID_number)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- Bảng thanh toán
CREATE TABLE Payment (
    Payment_ID INT PRIMARY KEY,
    Wallet_ID CHAR(8) NOT NULL,
    Payment_type ENUM('Nạp tiền', 'Chuyển tiền nội bộ', 'Thanh toán món ăn') NOT NULL,
        -- Nạp tiền, chuyển nội bộ, thanh toán món ăn
    Method ENUM('Banking', 'Ví điện tử', 'VietQR') NOT NULL,
        -- ATM/Banking, ví điện tử, VietQR
    Time_stamp DATETIME NOT NULL,
    Status_fooddy ENUM('Thành công', 'Thất bại', 'Đang xử lý') NOT NULL,
        -- Thành công, thất bại, đang xử lý
    Amount DECIMAL(10,2) NOT NULL
        CHECK (Amount >= 0),
    FOREIGN KEY (Wallet_ID) REFERENCES Wallet(Wallet_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- Bảng voucher
CREATE TABLE Voucher (
    Voucher_ID INT PRIMARY KEY,
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
    Food_ID INT PRIMARY KEY,
    Food_name VARCHAR(100) NOT NULL,
    Unit_price DECIMAL(10,2) NOT NULL CHECK (Unit_price >= 0),
    Availability_status ENUM('Còn hàng', 'Hết hàng', 'Ngừng bán')
        DEFAULT 'Còn hàng',
    Image VARCHAR(255),
    Quantity INT NOT NULL DEFAULT 0 CHECK (Quantity >= 0),
    Category VARCHAR(50) NOT NULL
);


-- Bảng order
CREATE TABLE Order_fooddy (
    Order_ID INT PRIMARY KEY,
    Customer_ID_number CHAR(12) NOT NULL,
    Food_ID INT NOT NULL,
    Log_ID INT NOT NULL,
    Payment_ID INT NOT NULL,
    Branch_ID INT NOT NULL,
    Pick_up_status ENUM('Chưa nhận', 'Đã nhận', 'Đã hủy')
		NOT NULL DEFAULT 'Chưa nhận',
    QR_code VARCHAR(255),
    Price DECIMAL(10,2) NOT NULL
        CHECK (Price >= 0),
    Quantity INT NOT NULL
        CHECK (Quantity > 0),
    Voucher_ID INT,
    Order_time DATETIME NOT NULL,
    FOREIGN KEY (Food_ID) REFERENCES ServedFood(Food_ID),
    FOREIGN KEY (Customer_ID_number) REFERENCES Customer(ID_number),
    FOREIGN KEY (Payment_ID) REFERENCES Payment(Payment_ID),
    FOREIGN KEY (Voucher_ID) REFERENCES Voucher(Voucher_ID),
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
);

-- Bảng transaction log
CREATE TABLE Transaction_log (
    Log_ID INT PRIMARY KEY,
    Staff_ID_number CHAR(12) NOT NULL
        CHECK (Staff_ID_number REGEXP '^[0-9]{12}$'),
    Action_time DATETIME NOT NULL,
    FOREIGN KEY (Staff_ID_number) REFERENCES Staff(ID_number)
);







-- Bảng thành phần nguyên liệu
CREATE TABLE Ingredient (
    Ingredient_ID INT PRIMARY KEY,
    Ingredient_name VARCHAR(100) NOT NULL,
    Quantity INT CHECK (Quantity >= 0) NOT NULL,
    Description_fooddy VARCHAR(255) NOT NULL,
    Unit VARCHAR(50) NOT NULL
);


-- Bảng công ty cung cấp
CREATE TABLE Company (
    Company_ID INT PRIMARY KEY,
    Company_name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) CHECK (Email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') NOT NULL,
    Phone_number VARCHAR(20) CHECK (Phone_number REGEXP '^[0-9]{9,11}$') NOT NULL
);

-- Bảng batch (lô hàng)
CREATE TABLE Batch (
    Batch_ID INT PRIMARY KEY,
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

DELIMITER $$

CREATE TRIGGER trg_payment_before_insert
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
    DECLARE wallet_balance DECIMAL(10,2);  -- phải khai báo đầu tiên

    IF NEW.Payment_type = 'FoodPayment' THEN
        SELECT Balance INTO wallet_balance
        FROM Wallet
        WHERE Wallet_ID = NEW.Wallet_ID;

        IF wallet_balance IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Wallet not found';
        END IF;

        IF wallet_balance < NEW.Amount THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Payment failed: insufficient wallet balance.';
        END IF;
    END IF;
END$$


CREATE TRIGGER trg_payment_before_update
BEFORE UPDATE ON Payment
FOR EACH ROW
BEGIN
	DECLARE wallet_balance DECIMAL(10,2);
    IF NEW.Payment_type = 'FoodPayment' THEN


        SELECT Balance INTO wallet_balance
        FROM Wallet
        WHERE Wallet_ID = NEW.Wallet_ID;

        IF wallet_balance IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Wallet not found';
        END IF;

        IF wallet_balance < NEW.Amount THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Update failed: insufficient wallet balance.';
        END IF;
    END IF;
END$$

CREATE TRIGGER trg_deposit_limit
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
    -- Chỉ áp dụng cho giao dịch nạp tiền
    IF NEW.Payment_type = 'Deposit' THEN
        IF NEW.Amount < 50000 OR NEW.Amount > 5000000 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Deposit amount must be between 50,000 and 5,000,000 VND';
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
    IF NEW.Payment_type = 'InternalTransfer' THEN

        -- Kiểm tra số tiền hợp lệ
        IF NEW.Amount < 10000 OR NEW.Amount > 2000000 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Internal transfer amount must be between 10,000 and 2,000,000 VND';
        END IF;

        -- Kiểm tra số lần giao dịch trong ngày
        SELECT COUNT(*) INTO transfer_count
        FROM Payment
        WHERE Wallet_ID = NEW.Wallet_ID
          AND Payment_type = 'InternalTransfer'
          AND DATE(Time_stamp) = DATE(NEW.Time_stamp);

        IF transfer_count >= 5 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Exceeded maximum 5 internal transfers per day';
        END IF;

    END IF;
END$$

CREATE TRIGGER trg_order_before_insert
BEFORE INSERT ON Order_fooddy
FOR EACH ROW
BEGIN
    DECLARE food_status ENUM('Còn hàng','Hết hàng','Ngừng bán');
    DECLARE branch_status ENUM('Active','Inactive','Closed');

    -- Lấy trạng thái món ăn
    SELECT Availability_status INTO food_status
    FROM ServedFood
    WHERE Food_ID = NEW.Food_ID;

    IF food_status = 'Hết hàng' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot create order: food is out of stock';
    END IF;

    -- Lấy trạng thái chi nhánh
    SELECT Branch_status INTO branch_status
    FROM Branch
    WHERE Branch_ID = NEW.Branch_ID;

    IF branch_status <> 'Active' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot create order: branch is not active';
    END IF;

END$$

CREATE TRIGGER trg_order_quantity_limit
BEFORE INSERT ON Order_fooddy
FOR EACH ROW
BEGIN
    IF NEW.Quantity > 20 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot create order: quantity of a single food cannot exceed 20';
    END IF;
END$$

CREATE TRIGGER trg_voucher_duration_insert
BEFORE INSERT ON Voucher
FOR EACH ROW
BEGIN
    IF DATEDIFF(NEW.Date_end, NEW.Date_start) > 30 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Voucher duration cannot exceed 30 days';
    END IF;
END$$

-- Trigger trước khi cập nhật voucher
CREATE TRIGGER trg_voucher_duration_update
BEFORE UPDATE ON Voucher
FOR EACH ROW
BEGIN
    IF DATEDIFF(NEW.Date_end, NEW.Date_start) > 30 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Voucher duration cannot exceed 30 days';
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
        JOIN Has h ON s.ID_number = NEW.ID_number
        WHERE s.Shift = NEW.Shift
        -- Giả sử bảng Shift_type chỉ lưu ca, không lưu ngày; nếu có ngày thì thêm điều kiện ngày
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Employee can only have one shift at one branch at a time';
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
        SET MESSAGE_TEXT = 'StartDate of manager must be >= RegistrationDate of employee';
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
        SET MESSAGE_TEXT = 'Employee age must be between 18 and 60 years';
    END IF;
END$$

DELIMITER ;


SET FOREIGN_KEY_CHECKS = 0;
INSERT INTO Branch 
VALUES
(1, '123 Nguyễn Văn Cừ, Q5, HCM', '0901234567', '7:00-22:00', 'Active', '621133675424', '2000-01-10'),
(2, '45 Lý Thường Kiệt, Q10, HCM', '0909876543', '8:00-21:00', 'Active', '621133672159', '2000-01-10'),
(3, '12 Hai Bà Trưng, Q1, HCM', '0911222333', '6:30-23:00', 'Active', '621133672157', '2000-01-10'),
(4, '689 Võ Thị Sáu, Q7, HCM', '0909876598', '8:00-21:00', 'Active', '621133672160', '2000-01-10'),
(5, '699 Quang Trung, Q9, HCM', '0909800011', '8:00-21:00', 'Active', '621133672161', '2000-01-10');

SET FOREIGN_KEY_CHECKS = 1;



INSERT INTO User_fooddy 
VALUES
('621133672156', 'Nguyễn Minh Tín', '1990-03-15', 'BK1', 'minhtin123@fooddy.vn', 'Manager', '0901141111', '2024-01-01', 'Bình thường'),
('621133672157', 'Trần Thị Huyền', '1995-05-22', 'BK2', 'huenaaa1@fooddy.vn', 'Manager', '0902225622', '2024-02-01', 'Bình thường'),
('621133672159', 'Nguyễn Minh Tạ', '2005-03-19', 'USSH1', 'minhtatata@fooddy.vn', 'Manager', '0901471111', '2024-01-01', 'Bình thường'),
('621133672160', 'Trần Lê Hà Yến', '2004-08-11', 'USSH2', 'yenleha123456@fooddy.vn', 'Manager', '0907142222', '2024-02-01', 'Bình thường'),
('621133672161', 'Hồ Ngọc Hà', '2001-09-10', 'UIT', 'hahaha123@fooddy.vn', 'Manager', '0903333333', '2024-03-01', 'Bình thường'),
-- 20 STAFF (không phải manager)
('621133672158', 'Lê Nguyễn Minh Thư', '1998-09-10', 'BK1', 'minthu910@fooddy.vn', 'Staff', '0908943333', '2024-03-01', 'Bình thường'),
('621133672200', 'Phạm Quốc Hưng', '1998-04-12', 'BK1', 'hunghp01@fooddy.vn', 'Staff', '0904444441', '2024-03-05', 'Bình thường'),
('621133672201', 'Nguyễn Minh Khải', '1999-07-19', 'BK1', 'khainguyen99@fooddy.vn', 'Staff', '0904444442', '2024-03-05', 'Bình thường'),
('621133672202', 'Trần Bảo Long', '2000-02-10', 'BK1', 'longbao2000@fooddy.vn', 'Staff', '0904444443', '2024-03-05', 'Bình thường'),
('621133672203', 'Lê Thanh Tùng', '1997-10-05', 'BK1', 'tungle97@fooddy.vn', 'Staff', '0904444444', '2024-03-05', 'Bình thường'),
('621133672204', 'Huỳnh Nhật Tân', '2001-12-01', 'BK2', 'tanhuynh01@fooddy.vn', 'Staff', '0904444445', '2024-03-05', 'Bình thường'),
('621133672205', 'Đỗ Triệu Dương', '1996-03-14', 'BK2', 'duongtrieu96@fooddy.vn', 'Staff', '0904444446', '2024-03-05', 'Bình thường'),
('621133672206', 'Nguyễn Hải Đăng', '1995-11-21', 'BK2', 'dangnguyen95@fooddy.vn', 'Staff', '0904444447', '2024-03-05', 'Bình thường'),
('621133672207', 'Phan Nhật Nam', '2002-09-02', 'BK2', 'namphan02@fooddy.vn', 'Staff', '0904444448', '2024-03-05', 'Bình thường'),
('621133672208', 'Bùi Võ Thiên', '1994-07-30', 'BK2', 'thienbuiv@fooddy.vn', 'Staff', '0904444449', '2024-03-05', 'Bình thường'),
('621133672209', 'Lâm Hoàng Khang', '1993-01-22', 'USSH1', 'khanglam93@fooddy.vn', 'Staff', '0904444450', '2024-03-05', 'Bình thường'),
('621133672210', 'Hồ Đức Huy', '2000-05-18', 'USSH1', 'huyhdd@fooddy.vn', 'Staff', '0904444451', '2024-03-05', 'Bình thường'),
('621133672211', 'Đặng Xuân Sang', '1999-02-25', 'USSH1', 'sangdx@fooddy.vn', 'Staff', '0904444452', '2024-03-05', 'Bình thường'),
('621133672212', 'Nguyễn Quang Hiếu', '2001-09-12', 'USSH1', 'hieuquang01@fooddy.vn', 'Staff', '0904444453', '2024-03-05', 'Bình thường'),
('621133672213', 'Trương Tấn Tài', '1997-11-07', 'USSH1', 'taitruong97@fooddy.vn', 'Staff', '0904444454', '2024-03-05', 'Bình thường'),
('621133672214', 'Võ Trung Dũng', '1998-03-09', 'USSH2', 'dungvo98@fooddy.vn', 'Staff', '0904444455', '2024-03-05', 'Bình thường'),
('621133672215', 'Nguyễn Nhật Quang', '1996-06-10', 'USSH2', 'quangnn96@fooddy.vn', 'Staff', '0904444456', '2024-03-05', 'Bình thường'),
('621133672216', 'Phạm Đức Hoàng', '1995-01-29', 'USSH2 Service', 'hoangpd95@fooddy.vn', 'Staff', '0904444457', '2024-03-05', 'Bình thường'),
('621133672217', 'Châu Tấn Lợi', '2003-02-14', 'USSH2', 'loitanchau@fooddy.vn', 'Staff', '0904444458', '2024-03-05', 'Bình thường'),
('621133672218', 'Nguyễn Hữu Phúc', '1994-09-10', 'UIT', 'phuchn94@fooddy.vn', 'Staff', '0904444459', '2024-03-05', 'Bình thường'),
('621133672219', 'Trần Quang Minh', '2002-04-03', 'UIT', 'minhquang02@fooddy.vn', 'Staff', '0904444460', '2024-03-05', 'Bình thường'),
('621133672222', 'Trần Hoài Bảo', '1998-08-09', 'UIT', 'baotran98@fooddy.vn', 'Staff', '0905555553', '2024-03-06', 'Bình thường'),
('621133672223', 'Nguyễn Mai Linh', '1997-02-17', 'UIT', 'linhmailinh@fooddy.vn', 'Staff', '0905555554', '2024-03-06', 'Bình thường'),

-- 5 người khác (KHÔNG phải Manager)
('621133675121', 'Nguyễn Văn Linh', '2000-01-10', 'BK1', 'lindan@gmail.com', 'Customer', '0901234567', '2024-03-01', 'Bình thường'),
('621133675122', 'Trần Thị Hà Linh', '1999-05-20', 'BK1', 'linlin11@gmail.com', 'Customer', '0902234567', '2024-03-01', 'Bình thường'),
('621133675123', 'Lê Văn Quân', '2002-08-30', 'BK2', 'minwuan11111@gmail.com', 'Customer', '0903234567', '2024-03-02', 'Bình thường'),
('621133672124', 'Tạ Quang Quân', '2008-08-31', 'BK2', 'quangquan2008@gmail.com', 'Customer', '0903235436', '2024-03-02', 'Bình thường'),
('621133672155', 'Nguyên Long Hưng', '2006-02-27', 'USSH1', 'lonhungg@gmail.com', 'Customer', '0903237694', '2024-03-02', 'Bình thường'),
('621133672220', 'Hồ Phước An', '2004-05-12', 'USSH2', 'anhophuoc@gmail.com', 'Customer', '0905555551', '2024-03-06', 'Bình thường'),
('621133672221', 'Lê Mỹ Duyên', '2001-12-20', 'UIT', 'myduyen01@gmail.com', 'Customer', '0905555552', '2024-03-06', 'Bình thường'),
('621133672224', 'Vũ Gia Hân', '2003-11-28', 'UIT', 'giahanvu@gmail.com', 'Customer', '0905555555', '2024-03-06', 'Bình thường');
INSERT INTO Staff (ID_number, Salary, Hire_date, Branch_ID, Supervisior_ID_number)
VALUES
-- Managers (không có supervisor)
('621133672156', 12000000, '2024-01-01', 1, NULL),  -- BK1 Manager
('621133672157', 12000000, '2024-02-01', 2, NULL),  -- BK2 Manager
('621133672159', 12000000, '2024-01-01', 3, NULL),  -- USSH1 Manager
('621133672160', 12000000, '2024-02-01', 4, NULL),  -- USSH2 Manager
('621133672161', 12000000, '2024-03-01', 5, NULL),  -- UIT Manager

-- Staff BK1
('621133672158', 8000000, '2024-03-01', 1, '621133672156'),
('621133672200', 7500000, '2024-03-05', 1, '621133672156'),
('621133672201', 7200000, '2024-03-05', 1, '621133672156'),
('621133672202', 7700000, '2024-03-05', 1, '621133672156'),
('621133672203', 7000000, '2024-03-05', 1, '621133672156'),

-- Staff BK2
('621133672204', 6800000, '2024-03-05', 2, '621133672157'),
('621133672205', 7200000, '2024-03-05', 2, '621133672157'),
('621133672206', 8000000, '2024-03-05', 2, '621133672157'),
('621133672207', 7500000, '2024-03-05', 2, '621133672157'),
('621133672208', 7700000, '2024-03-05', 2, '621133672157'),

-- Staff USSH1
('621133672209', 7200000, '2024-03-05', 3, '621133672159'),
('621133672210', 7800000, '2024-03-05', 3, '621133672159'),
('621133672211', 7400000, '2024-03-05', 3, '621133672159'),
('621133672212', 7600000, '2024-03-05', 3, '621133672159'),
('621133672213', 7300000, '2024-03-05', 3, '621133672159'),

-- Staff USSH2
('621133672214', 7500000, '2024-03-05', 4, '621133672160'),
('621133672215', 7100000, '2024-03-05', 4, '621133672160'),
('621133672216', 7200000, '2024-03-05', 4, '621133672160'),
('621133672217', 7400000, '2024-03-05', 4, '621133672160'),

-- Staff UIT
('621133672218', 7600000, '2024-03-05', 5, '621133672161'),
('621133672219', 7800000, '2024-03-05', 5, '621133672161'),
('621133672222', 7200000, '2024-03-06', 5, '621133672161'),
('621133672223', 7500000, '2024-03-06', 5, '621133672161');


INSERT INTO Customer (ID_number)
VALUES
('621133675121'),
('621133675122'),
('621133675123'),
('621133672124'),
('621133672155'),
('621133672220'),
('621133672221'),
('621133672224');


INSERT INTO Wallet (Wallet_ID, Customer_ID_number, Balance, Last_updated)
VALUES
('00000001', '621133675121', 500000, '2025-11-24 09:00:00'),
('00000002', '621133675122', 500000, '2025-11-23 15:30:00'),
('00000003', '621133675123', 500000, '2025-11-22 12:15:00'),
('00000004', '621133672124', 200000, '2025-11-21 18:45:00'),
('00000005', '621133672155', 505000, '2025-11-20 08:20:00'),
('00000006', '621133672220', 520000, '2025-11-19 14:10:00'),
('00000007', '621133672221', 530000, '2025-11-18 11:05:00'),
('00000008', '621133672224', 590000, '2025-11-17 20:30:00');



-- Chèn dữ liệu Payment hợp lệ
INSERT INTO Payment (Payment_ID, Wallet_ID, Payment_type, Method, Time_stamp, Status_fooddy, Amount)
VALUES
(1, '00000001', 'Nạp tiền', 'Banking', '2025-11-20 09:00:00', 'Thành công', 500000.00),
(2, '00000002', 'Thanh toán món ăn', 'Ví điện tử', '2025-11-21 12:30:00', 'Đang xử lý', 100000.00),  -- ≤ 500000
(3, '00000003', 'Nạp tiền', 'VietQR', '2025-11-22 15:45:00', 'Thành công', 300000.00),
(4, '00000004', 'Chuyển tiền nội bộ', 'Banking', '2025-11-23 10:15:00', 'Thành công', 100000.00),
(5, '00000005', 'Thanh toán món ăn', 'Ví điện tử', '2025-11-23 18:00:00', 'Thành công', 75000.00),       -- ≤ 500000
(6, '00000006', 'Nạp tiền', 'Banking', '2025-11-24 08:20:00', 'Thành công', 200000.00),
(7, '00000007', 'Thanh toán món ăn', 'VietQR', '2025-11-24 11:10:00', 'Đang xử lý', 50000.00),    -- ≤ 500000
(8, '00000008', 'Chuyển tiền nội bộ', 'Ví điện tử', '2025-11-24 14:50:00', 'Thất bại', 90000.00),
(9, '00000001', 'Thanh toán món ăn', 'VietQR', '2025-11-24 16:30:00', 'Thành công', 150000.00),      -- ≤ 500000
(10,'00000002', 'Nạp tiền', 'Banking', '2025-11-24 17:45:00', 'Thành công', 300000.00);

INSERT INTO Voucher (Voucher_ID, Description_voucher, Discount_value, Status_voucher, Date_start, Date_end, Branch_ID)
VALUES
(501, 'Giảm 10% đơn hàng trên 100k', 10, 'Còn hiệu lực', '2025-10-05', '2025-10-31', 1),
(502, 'Giảm 20% cho thành viên mới', 20, 'Còn hiệu lực', '2025-11-01', '2025-11-30', 2),
(503, 'Tặng nước khi mua combo', 0, 'Hết hạn', '2025-05-15', '2025-06-01', 3),
(504, 'Tặng nước khi mua combo', 0, 'Còn hiệu lực', '2025-05-01', '2025-05-15', 4),
(505, 'Giảm 50% cho đơn hàng', 50, 'Hết hạn', '2025-06-01', '2025-06-21', 5);

INSERT INTO ServedFood (Food_ID, Food_name, Unit_price, Availability_status, Image, Quantity, Category)
VALUES
(1, 'Phở Bò', 50000.00, 'Còn hàng', 'pho_bo.jpg', 50, 'Món chính'),
(2, 'Bún Chả', 45000.00, 'Còn hàng', 'bun_cha.jpg', 30, 'Ăn sáng'),
(3, 'Cơm Tấm', 40000.00, 'Còn hàng', 'com_tam.jpg', 40, 'Món chính'),
(4, 'Gỏi Cuốn', 30000.00, 'Còn hàng', 'goi_cuon.jpg', 60, 'Ăn sáng'),
(5, 'Bánh Mì', 25000.00, 'Hết hàng', 'banh_mi.jpg', 0, 'Ăn sáng'),
(6, 'Phở Gà', 48000.00, 'Còn hàng', 'pho_ga.jpg', 35, 'Món chính'),
(7, 'Bánh Xèo', 55000.00, 'Còn hàng', 'banh_xeo.jpg', 25, 'Ăn sáng'),
(8, 'Mì Quảng', 60000.00, 'Còn hàng', 'mi_quang.jpg', 20, 'Món chính'),
(9, 'Cháo Gà', 35000.00, 'Còn hàng', 'chao_ga.jpg', 45, 'Món chính'),
(10, 'Bún Bò Huế', 65000.00, 'Còn hàng', 'bun_bo_hue.jpg', 30, 'Món chính'),
(11, 'Sushi Set', 120000.00, 'Còn hàng', 'sushi_set.jpg', 15, 'Món chính'),
(12, 'Ramen', 95000.00, 'Còn hàng', 'ramen.jpg', 20, 'Món chính'),
(13, 'Tempura', 80000.00, 'Hết hàng', 'tempura.jpg', 0, 'Món chính'),
(14, 'Cơm Sushi', 90000.00, 'Còn hàng', 'com_sushi.jpg', 25, 'Món chính'),
(15, 'Pizza Margherita', 150000.00, 'Còn hàng', 'pizza_margherita.jpg', 10, 'Món chính'),
(16, 'Spaghetti Bolognese', 130000.00, 'Còn hàng', 'spaghetti.jpg', 12, 'Món chính'),
(17, 'Lasagna', 140000.00, 'Còn hàng', 'lasagna.jpg', 8, 'Món chính'),
(18, 'Risotto', 135000.00, 'Còn hàng', 'risotto.jpg', 7, 'Món chính'),
(19, 'Tiramisu', 70000.00, 'Còn hàng', 'tiramisu.jpg', 20, 'Tráng miệng'),
(20, 'Panna Cotta', 65000.00, 'Còn hàng', 'panna_cotta.jpg', 18, 'Tráng miệng'),
(21, 'Trà sữa chân châu', 15000.00, 'Còn hàng', 'tiramisu.jpg', 20, 'Đồ uống'),
(22, 'Trà chanh', 10000.00, 'Còn hàng', 'trachanh.jpg', 20, 'Đồ uống'),
(23, 'Cà phê đen', 10000.00, 'Còn hàng', 'capheden.jpg', 20, 'Đồ uống'),
(24, 'Bạc xỉu', 15000.00, 'Còn hàng', 'bacxiu.jpg', 20, 'Đồ uống'),
(25, 'Sting', 10000.00, 'Còn hàng', 'sting.jpg', 20, 'Đồ uống');
INSERT INTO Order_fooddy (Order_ID, Customer_ID_number, Food_ID, Log_ID, Payment_ID, Branch_ID, Pick_up_status, QR_code, Price, Quantity, Voucher_ID, Order_time)
VALUES
(1, '621133675121', 1, 101, 1, 1, 'Chưa nhận', 'QR0001', 50000.00, 1, NULL, '2025-11-24 09:10:00'),
(2, '621133675122', 2, 102, 2, 1, 'Đã nhận', 'QR0002', 45000.00, 2, NULL, '2025-11-23 16:00:00'),
(3, '621133675123', 3, 103, 3, 1, 'Đã hủy', 'QR0003', 40000.00, 1, NULL, '2025-11-22 12:30:00'),
(4, '621133672124', 4, 104, 4, 2, 'Chưa nhận', 'QR0004', 30000.00, 2, NULL, '2025-11-21 19:00:00'),
(5, '621133672155', 6, 105, 5, 2, 'Đã nhận', 'QR0005', 48000.00, 1, NULL, '2025-11-20 08:45:00'),
(6, '621133672220', 11, 106, 6, 3, 'Chưa nhận', 'QR0006', 120000.00, 1, NULL, '2025-11-19 14:30:00'),
(7, '621133672221', 12, 107, 7, 3, 'Đã nhận', 'QR0007', 95000.00, 1, NULL, '2025-11-18 11:20:00'),
(8, '621133672224', 15, 108, 8, 4, 'Chưa nhận', 'QR0008', 150000.00, 1, NULL, '2025-11-17 21:00:00'),
(9, '621133675121', 16, 109, 1, 4, 'Đã nhận', 'QR0009', 130000.00, 1, NULL, '2025-11-16 13:15:00'),
(10, '621133675122', 17, 110, 2, 4, 'Chưa nhận', 'QR0010', 140000.00, 1, NULL, '2025-11-15 17:45:00');

INSERT INTO Transaction_log (Log_ID, Staff_ID_number, Action_time)
VALUES
(101, '621133672158', '2025-11-01 08:15:00'),
(102, '621133672200', '2025-11-02 09:30:00'),
(103, '621133672201', '2025-11-03 10:45:00'),
(104, '621133672202', '2025-11-04 11:20:00'),
(105, '621133672203', '2025-11-05 12:10:00'),
(106, '621133672204', '2025-11-06 13:50:00'),
(107, '621133672205', '2025-11-07 14:30:00'),
(108, '621133672206', '2025-11-08 15:05:00'),
(109, '621133672207', '2025-11-09 16:25:00'),
(110, '621133672208', '2025-11-10 17:40:00');

INSERT INTO Ingredient (Ingredient_ID, Ingredient_name, Quantity, Description_fooddy, Unit)
VALUES
(1, 'Gạo', 100, 'Nguyên liệu cơ bản cho các món cơm', 'kg'),
(2, 'Thịt heo', 50, 'Nguyên liệu làm các món thịt heo', 'kg'),
(3, 'Thịt bò', 40, 'Nguyên liệu làm các món thịt bò', 'kg'),
(4, 'Gà', 60, 'Nguyên liệu làm các món gà', 'kg'),
(5, 'Cá hồi', 30, 'Nguyên liệu làm các món cá', 'kg'),
(6, 'Cà chua', 80, 'Nguyên liệu chế biến món xào, salad', 'kg'),
(7, 'Dưa leo', 70, 'Nguyên liệu làm salad', 'kg'),
(8, 'Hành tây', 50, 'Nguyên liệu xào nấu', 'kg'),
(9, 'Tỏi', 20, 'Nguyên liệu gia vị', 'kg'),
(10, 'Ớt', 25, 'Nguyên liệu gia vị', 'kg'),
(11, 'Mì ống', 60, 'Nguyên liệu làm pasta', 'kg'),
(12, 'Bột năng', 40, 'Nguyên liệu làm các món xốt', 'kg'),
(13, 'Trứng gà', 120, 'Nguyên liệu làm món trứng, bánh', 'quả'),
(14, 'Sữa tươi', 80, 'Nguyên liệu làm đồ uống, bánh', 'lít'),
(15, 'Phô mai', 50, 'Nguyên liệu làm pizza, salad', 'kg'),
(16, 'Rau cải', 90, 'Nguyên liệu xào hoặc salad', 'kg'),
(17, 'Khoai tây', 70, 'Nguyên liệu làm món chiên, nướng', 'kg'),
(18, 'Bánh mì', 100, 'Nguyên liệu làm sandwich', 'cái'),
(19, 'Đường', 60, 'Nguyên liệu làm bánh, nước ngọt', 'kg'),
(20, 'Muối', 40, 'Nguyên liệu gia vị', 'kg');

INSERT INTO Company (Company_ID, Company_name, Email, Phone_number)
VALUES
(1, 'Công ty TNHH Thực Phẩm ABC', 'contact@abcfood.vn', '0901234567'),
(2, 'Công ty Cổ phần Nông Sản XYZ', 'info@xyzagri.vn', '0912345678'),
(3, 'Công ty TNHH Gia Vị Việt', 'sales@viethubspice.vn', '0923456789'),
(4, 'Công ty Cổ phần Đồ Uống Fresh', 'support@freshdrink.vn', '0934567890'),
(5, 'Công ty TNHH Hải Sản Ocean', 'oceanseafood@vn.com', '0945678901');

-- 10 batch mẫu
INSERT INTO Batch (Batch_ID, Production_date, Batch_name, Quantity, Recived_date, Cost, Delivery_date, Company_ID, Branch_ID)
VALUES
(1, '2025-11-01', 'Lô gạo A', 500, '2025-11-03', 1500000.00, '2025-11-05', 1, 1),
(2, '2025-11-02', 'Lô rau củ B', 300, '2025-11-04', 900000.00, '2025-11-06', 2, 1),
(3, '2025-11-03', 'Lô thịt heo C', 200, '2025-11-05', 1200000.00, '2025-11-07', 3, 2),
(4, '2025-11-04', 'Lô cá tươi D', 150, '2025-11-06', 1800000.00, '2025-11-08', 5, 2),
(5, '2025-11-05', 'Lô gia vị E', 400, '2025-11-07', 600000.00, '2025-11-09', 3, 3),
(6, '2025-11-06', 'Lô bánh mì F', 250, '2025-11-08', 700000.00, '2025-11-10', 4, 3),
(7, '2025-11-07', 'Lô trứng G', 600, '2025-11-09', 900000.00, '2025-11-11', 2, 4),
(8, '2025-11-08', 'Lô sữa H', 350, '2025-11-10', 1100000.00, '2025-11-12', 4, 4),
(9, '2025-11-09', 'Lô trái cây I', 500, '2025-11-11', 1300000.00, '2025-11-13', 2, 5),
(10, '2025-11-10', 'Lô nước ép J', 300, '2025-11-12', 800000.00, '2025-11-14', 4, 5);

-- 20 record Contain (giả sử mỗi batch có 2 thành phần)
INSERT INTO Contain (Ingredient_ID, Batch_ID)
VALUES
(1,1),(2,1),
(3,2),(4,2),
(5,3),(6,3),
(7,4),(8,4),
(9,5),(10,5),
(11,6),(12,6),
(13,7),(14,7),
(15,8),(16,8),
(17,9),(18,9),
(19,10),(20,10);

-- Bảng Menu: tạo menu cho 5 chi nhánh, 3 ca mỗi ngày, 5 ngày
INSERT INTO Menu (Branch_ID, Shift, Date_menu)
VALUES
-- BK1
(1, 'Sáng',  '2025-11-24'),
(1, 'Chiều', '2025-11-24'),
(1, 'Sáng',  '2025-11-25'),
(1, 'Chiều', '2025-11-25'),
(1, 'Sáng',  '2025-11-26'),
(1, 'Chiều', '2025-11-26'),

-- BK2
(2, 'Sáng',  '2025-11-24'),
(2, 'Chiều', '2025-11-24'),
(2, 'Sáng',  '2025-11-25'),
(2, 'Chiều', '2025-11-25'),

-- USSH1
(3, 'Sáng',  '2025-11-24'),
(3, 'Chiều', '2025-11-24'),
(3, 'Sáng',  '2025-11-25'),
(3, 'Chiều', '2025-11-25'),

-- USSH2
(4, 'Sáng',  '2025-11-24'),
(4, 'Chiều', '2025-11-24'),

-- UIT
(5, 'Sáng',  '2025-11-24'),
(5, 'Chiều', '2025-11-24');


-- Bảng Has: phân bổ món ăn cho từng chi nhánh và ca
INSERT INTO Has (Food_ID, Branch_ID, Shift, Date_menu)
VALUES
-- BK1
(1, 1, 'Sáng',  '2025-11-24'),
(2, 1, 'Sáng',  '2025-11-24'),
(3, 1, 'Chiều', '2025-11-24'),
(4, 1, 'Chiều', '2025-11-24'),
(5, 1, 'Chiều', '2025-11-24'),
(6, 1, 'Chiều', '2025-11-24'),

-- BK2
(7, 2, 'Sáng',  '2025-11-24'),
(8, 2, 'Chiều', '2025-11-24'),
(9, 2, 'Chiều', '2025-11-24'),
(10,2, 'Sáng',  '2025-11-25'),
(11,2, 'Chiều', '2025-11-25'),
(12,2, 'Chiều', '2025-11-25'),

-- USSH1
(13,3, 'Sáng',  '2025-11-24'),
(14,3, 'Chiều', '2025-11-24'),
(15,3, 'Chiều', '2025-11-24'),
(16,3, 'Sáng',  '2025-11-25'),
(17,3, 'Chiều', '2025-11-25'),

-- USSH2
(18,4, 'Sáng',  '2025-11-24'),
(19,4, 'Chiều', '2025-11-24'),
(20,4, 'Chiều', '2025-11-24'),

-- UIT
(1, 5, 'Sáng',  '2025-11-24'),
(2, 5, 'Chiều', '2025-11-24'),
(3, 5, 'Sáng',  '2025-11-24'),
(4, 5, 'Chiều', '2025-11-24');

INSERT INTO Shift_type (Shift, ID_number)
VALUES
-- ===== Managers =====
('Sáng', '621133672156'), ('Chiều', '621133672156'),  -- BK1 manager
('Sáng', '621133672157'), ('Chiều', '621133672157'),  -- BK2 manager
('Sáng', '621133672159'), ('Chiều', '621133672159'),  -- USSH1 manager
('Sáng', '621133672160'), ('Chiều', '621133672160'),  -- USSH2 manager
('Sáng', '621133672161'), ('Chiều', '621133672161'),  -- UIT manager

-- ===== Staff BK1 =====
('Sáng', '621133672158'),
('Chiều', '621133672200'),
('Sáng', '621133672201'),
('Chiều', '621133672202'),
('Sáng', '621133672203'),

-- ===== Staff BK2 =====
('Sáng', '621133672204'),
('Chiều', '621133672205'),
('Sáng', '621133672206'),
('Chiều', '621133672207'),
('Sáng', '621133672208'),

-- ===== Staff USSH1 =====
('Sáng', '621133672209'),
('Chiều', '621133672210'),
('Sáng', '621133672211'),
('Chiều', '621133672212'),
('Sáng', '621133672213'),

-- ===== Staff USSH2 =====
('Chiều', '621133672214'),
('Sáng',  '621133672215'),
('Chiều', '621133672216'),
('Sáng',  '621133672217'),

-- ===== Staff UIT =====
('Sáng',  '621133672218'),
('Chiều', '621133672219'),
('Sáng',  '621133672222'),
('Chiều', '621133672223');



