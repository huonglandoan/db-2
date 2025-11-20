CREATE DATABASE IF NOT EXISTS Fooddy;
USE Fooddy;
-- Bảng chi nhánh
CREATE TABLE Branch (
    Branch_ID INT PRIMARY KEY,
    Address VARCHAR(255),
    Contact_number VARCHAR(20) CHECK (Contact_number REGEXP '^[0-9]{10}$'),
    Opening_hours VARCHAR(100),
    Branch_status VARCHAR(50),
    Manager_ID_number CHAR(12) CHECK (Manager_ID_number REGEXP '^[0-9]{12}$')
);
-- Bảng người dùng
CREATE TABLE User_fooddy (
    ID_number CHAR(12) PRIMARY KEY CHECK (ID_number REGEXP '^[0-9]{12}$'),
    Full_name VARCHAR(100),
    Date_of_birth DATE,
    Unit VARCHAR(100),
    Email VARCHAR(100),
    Position_fooddy VARCHAR(50),
    Phone_number VARCHAR(10) CHECK (Phone_number REGEXP '^[0-9]{10}$'),
    Registration_day DATE,
    Account_status VARCHAR(50)
);
-- Bảng khách hàng
CREATE TABLE Customer (
    ID_number CHAR(12) PRIMARY KEY CHECK (ID_number REGEXP '^[0-9]{12}$'),
    FOREIGN KEY (ID_number) REFERENCES User_fooddy(ID_number)
);
-- Bảng nhân viên
CREATE TABLE Staff (
    ID_number CHAR(12) PRIMARY KEY CHECK (ID_number REGEXP '^[0-9]{12}$'),
    Salary DECIMAL(10, 2) CHECK (Salary >= 0),
    Shift_type VARCHAR(50),
    Hire_date DATE,
    Branch_ID INT,
    Supervisior_ID_number CHAR(12),
    FOREIGN KEY (ID_number) REFERENCES User_fooddy(ID_number),
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
);
-- Bảng ví
CREATE TABLE Wallet (
    Wallet_ID INT PRIMARY KEY,
    Customer_ID_number CHAR(12) CHECK (Customer_ID_number REGEXP '^[0-9]{12}$'),
    Balance DECIMAL(10, 2) CHECK (Balance >= 0),
    Last_updated DATE,
    FOREIGN KEY (Customer_ID_number) REFERENCES Customer(ID_number)
);
-- Bảng thanh toán
CREATE TABLE Payment (
    Payment_ID INT PRIMARY KEY,
    Wallet_ID INT,
    Payment_type VARCHAR(50),
    Method VARCHAR(50),
    Time_stamp DATETIME,
    Status_fooddy VARCHAR(50),
    Amount DECIMAL(10, 2) CHECK (Amount >= 0),
    FOREIGN KEY (Wallet_ID) REFERENCES Wallet(Wallet_ID)
);
-- Bảng voucher
CREATE TABLE Voucher (
    Voucher_ID INT PRIMARY KEY,
    Description_voucher VARCHAR(255),
    Discount_value DECIMAL(5, 2) CHECK (
        Discount_value >= 0
        AND Discount_value <= 100
    ),
    Status_voucher VARCHAR(50),
    Date_start DATE,
    Date_end DATE,
    Branch_ID INT,
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID),
    CHECK (Date_end >= Date_start)
);
-- Bảng quản lý chi nhánh
CREATE TABLE Manage (
    ID_number CHAR(12) CHECK (ID_number REGEXP '^[0-9]{12}$'),
    Branch_ID INT,
    Start_day DATE,
    PRIMARY KEY (ID_number, Branch_ID),
    FOREIGN KEY (ID_number) REFERENCES Staff(ID_number),
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
);
-- Bảng thức ăn
CREATE TABLE Food (
    Food_ID VARCHAR(20) PRIMARY KEY,
    Food_name VARCHAR(100) NOT NULL,
    Description VARCHAR(500),
    -- Bổ sung cột Description
    Category VARCHAR(50) NOT NULL,
    -- Đổi tên cột cho khớp với Frontend (Food_type -> Category)
    Unit_price DECIMAL(10, 2) NOT NULL CHECK (Unit_price >= 0),
    Image_URL VARCHAR(255),
    -- Đổi tên cột cho rõ ràng hơn (Image -> Image_URL)
    Status VARCHAR(50) DEFAULT 'Còn hàng'
);
-- Bảng order
CREATE TABLE Order_fooddy (
    Order_ID INT PRIMARY KEY,
    Customer_ID_number CHAR(12) CHECK (Customer_ID_number REGEXP '^[0-9]{12}$'),
    Food_ID INT,
    Log_ID INT,
    Payment_ID INT,
    Total_amount DECIMAL(10, 2) CHECK (Total_amount >= 0),
    Pick_up_status VARCHAR(50),
    QR_code VARCHAR(255),
    Price DECIMAL(10, 2) CHECK (Price >= 0),
    Quantity INT CHECK (Quantity > 0),
    Voucher_ID INT,
    Order_time DATETIME,
    FOREIGN KEY (Customer_ID_number) REFERENCES Customer(ID_number),
    FOREIGN KEY (Payment_ID) REFERENCES Payment(Payment_ID),
    FOREIGN KEY (Voucher_ID) REFERENCES Voucher(Voucher_ID),
    FOREIGN KEY (Food_ID) REFERENCES Food(Food_ID)
);
-- Bảng transaction log
CREATE TABLE Transaction_log (
    Log_ID INT PRIMARY KEY,
    Staff_ID_number CHAR(12) CHECK (Staff_ID_number REGEXP '^[0-9]{12}$'),
    Action_time DATETIME,
    Reason VARCHAR(255),
    FOREIGN KEY (Staff_ID_number) REFERENCES Staff(ID_number)
);
-- Bảng món ăn phục vụ
CREATE TABLE ServedFood (
    Food_ID INT PRIMARY KEY,
    FOREIGN KEY (Food_ID) REFERENCES Food(Food_ID)
);
-- Bảng món ăn trong kho
CREATE TABLE StockedFood (
    Food_ID INT PRIMARY KEY,
    Expiry_date DATE,
    Manufacture_date DATE,
    FOREIGN KEY (Food_ID) REFERENCES Food(Food_ID)
);
-- Bảng thành phần nguyên liệu
CREATE TABLE Ingredient (
    Ingredient_ID INT PRIMARY KEY,
    Ingredient_name VARCHAR(100),
    Quantity INT CHECK (Quantity >= 0),
    Description_fooddy VARCHAR(255),
    Unit VARCHAR(50)
);
-- Bảng công ty cung cấp
CREATE TABLE Company (
    Company_ID INT PRIMARY KEY,
    Company_name VARCHAR(100),
    Email VARCHAR(100) CHECK (Email LIKE '%@%.%'),
    Phone_number VARCHAR(20) CHECK (Phone_number REGEXP '^[0-9]{9,11}$')
);
-- Bảng batch (lô hàng)
CREATE TABLE Batch (
    Batch_ID INT PRIMARY KEY,
    Product_date DATE,
    Batch_name VARCHAR(100),
    Quantity INT CHECK (Quantity >= 0),
    Recived_date DATE,
    Cost DECIMAL(10, 2) CHECK (Cost >= 0),
    Delivery_date DATE,
    Company_ID INT,
    Food_ID INT,
    Branch_ID INT,
    FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID),
    FOREIGN KEY (Food_ID) REFERENCES Food(Food_ID),
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
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
    Shift VARCHAR(50) CHECK (Shift IN ('Morning', 'Afternoon', 'Evening')),
    Date_menu DATE,
    PRIMARY KEY (Branch_ID, Shift, Date_menu),
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
);
-- Bảng Has (chi nhánh có món ăn)
CREATE TABLE Has (
    Food_ID INT,
    Branch_ID INT,
    PRIMARY KEY (Food_ID, Branch_ID),
    FOREIGN KEY (Food_ID) REFERENCES Food(Food_ID),
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
);
-- Bảng áp dụng voucher
CREATE TABLE ApplicableBranch (
    Branch_ID INT,
    Voucher_ID INT,
    PRIMARY KEY (Branch_ID, Voucher_ID),
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID),
    FOREIGN KEY (Voucher_ID) REFERENCES Voucher(Voucher_ID)
);
INSERT INTO Branch (
        Branch_ID,
        Address,
        Contact_number,
        Opening_hours,
        Branch_status,
        Manager_ID_number
    )
VALUES (
        1,
        '123 Nguyễn Văn Cừ, Q5, HCM',
        '0901234567',
        '7:00-22:00',
        'Active',
        '621133675424'
    ),
    (
        2,
        '45 Lý Thường Kiệt, Q10, HCM',
        '0909876543',
        '8:00-21:00',
        'Active',
        '621133675525'
    ),
    (
        3,
        '12 Hai Bà Trưng, Q1, HCM',
        '0911222333',
        '6:30-23:00',
        'Inactive',
        '621133675727'
    ),
    (
        4,
        '689 Võ Thị Sáu, Q7, HCM',
        '0909876598',
        '8:00-21:00',
        'Active',
        '621133675828'
    ),
    (
        5,
        '699 Quang Trung, Q9, HCM',
        '0909800011',
        '8:00-21:00',
        'Active',
        '621133675929'
    );
INSERT INTO User_fooddy (
        ID_number,
        Full_name,
        Date_of_birth,
        Unit,
        Email,
        Position_fooddy,
        Phone_number,
        Registration_day,
        Account_status
    )
VALUES (
        '621133675121',
        'Nguyễn Văn linh',
        '2000-01-10',
        'Customer',
        'lindan@gmail.com',
        'Customer',
        '0901234567',
        '2024-03-01',
        'Active'
    ),
    (
        '621133675222',
        'Trần Thị Hà Linh',
        '1999-05-20',
        'Customer',
        'linlin11@gmail.com',
        'Customer',
        '0902234567',
        '2024-03-01',
        'Active'
    ),
    (
        '621133675323',
        'Lê Văn Quân',
        '2002-08-30',
        'Customer',
        'minwuan11111@gmail.com',
        'Customer',
        '0903234567',
        '2024-03-02',
        'Active'
    ),
    (
        '621133672424',
        'Tạ Quang Quân',
        '2008-08-31',
        'Customer',
        'quangquan2008@gmail.com',
        'Customer',
        '0903235436',
        '2024-03-02',
        'Active'
    ),
    (
        '621133672355',
        'Nguyên Long Hưng',
        '2006-02-27',
        'Customer',
        'lonhungg@gmail.com',
        'Customer',
        '0903237694',
        '2024-03-02',
        'Active'
    ),
    (
        '621133675424',
        'Nguyễn Minh Tín',
        '1990-03-15',
        'Sales',
        'minhtin123@fooddy.vn',
        'Manager',
        '0901111111',
        '2024-01-01',
        'Active'
    ),
    (
        '621133675525',
        'Trần Thị Huyền',
        '1995-05-22',
        'HR',
        'huenaaa1@fooddy.vn',
        'Manager',
        '0902222222',
        '2024-02-01',
        'Active'
    ),
    (
        '621133675626',
        'Lê Nguyễn Minh Thư',
        '1998-09-10',
        'Kitchen',
        'minthu910@fooddy.vn',
        'Staff',
        '0903333333',
        '2024-03-01',
        'Active'
    ),
    (
        '621133675727',
        'Nguyễn Minh Tạ',
        '2005-03-19',
        'Manager',
        'minhtatata@fooddy.vn',
        'Manager',
        '0901111111',
        '2024-01-01',
        'Active'
    ),
    (
        '621133675828',
        'Trần Lê Hà Yến',
        '2004-08-11',
        'Manager',
        'yenleha123456@fooddy.vn',
        'Manager',
        '0902222222',
        '2024-02-01',
        'Active'
    ),
    (
        '621133675929',
        'Hồ Ngọc Hà',
        '2001-09-10',
        'Manager',
        'hahaha123@fooddy.vn',
        'Manager',
        '0903333333',
        '2024-03-01',
        'Active'
    );
INSERT INTO Staff (
        ID_number,
        Salary,
        Shift_type,
        Hire_date,
        Branch_ID,
        Supervisior_ID_number
    )
VALUES (
        '621133675424',
        20000000,
        'Full-time',
        '2023-01-10',
        1,
        NULL
    ),
    (
        '621133675525',
        15000000,
        'Full-time',
        '2023-03-15',
        2,
        '621133675626'
    ),
    (
        '621133675626',
        12000000,
        'Part-time',
        '2023-06-05',
        3,
        '621133675424'
    ),
    (
        '621133675727',
        12000000,
        'Full-time',
        '2023-07-01',
        3,
        '621133675929'
    ),
    (
        '621133675828',
        12000000,
        'Full-time',
        '2023-11-29',
        4,
        '621133675525'
    ),
    (
        '621133675929',
        12000000,
        'Full-time',
        '2024-03-02',
        5,
        '621133675828'
    );
INSERT INTO Customer (ID_number)
VALUES ('621133675121'),
    ('621133675222'),
    ('621133675323'),
    ('621133672424'),
    ('621133672355');
INSERT INTO Manage (ID_number, Start_day, Branch_ID)
VALUES ('621133675424', '2024-02-10', 1),
    ('621133675727', '2024-05-15', 3),
    ('621133675828', '2024-08-01', 4),
    ('621133675929', '2024-08-01', 5),
    ('621133675525', '2024-08-01', 2);
INSERT INTO Wallet (
        Wallet_ID,
        Customer_ID_number,
        Balance,
        Last_updated
    )
VALUES (40000123, '621133675121', 500000, '2025-01-10'),
    (40232025, '621133675222', 250000, '2025-02-20'),
    (40236547, '621133675323', 1000000, '2025-04-12'),
    (40231527, '621133672424', 1809000, '2025-12-25'),
    (40976347, '621133672355', 1520000, '2025-02-15');
INSERT INTO Payment (
        Payment_ID,
        Wallet_ID,
        Payment_type,
        Method,
        Time_stamp,
        Status_fooddy,
        Amount
    )
VALUES (
        10,
        40000123,
        'Online',
        'Credit Card',
        '2025-10-27 09:00:00',
        'Completed',
        150000
    ),
    (
        11,
        40232025,
        'Offline',
        'Cash',
        '2025-10-27 10:30:00',
        'Completed',
        80000
    ),
    (
        12,
        40236547,
        'Online',
        'Momo',
        '2025-10-28 11:00:00',
        'Pending',
        120000
    ),
    (
        13,
        40231527,
        'Offline',
        'Cash',
        '2025-10-27 10:30:00',
        'Completed',
        80000
    ),
    (
        14,
        40976347,
        'Offline',
        'Cash',
        '2025-10-27 10:30:00',
        'Completed',
        80000
    );
INSERT INTO Voucher (
        Voucher_ID,
        Description_voucher,
        Discount_value,
        Status_voucher,
        Date_start,
        Date_end,
        Branch_ID
    )
VALUES (
        501,
        'Giảm 10% đơn hàng trên 100k',
        10,
        'Active',
        '2025-10-01',
        '2025-12-31',
        1
    ),
    (
        502,
        'Giảm 20% cho thành viên mới',
        20,
        'Active',
        '2025-09-01',
        '2025-11-30',
        2
    ),
    (
        503,
        'Tặng nước khi mua combo',
        0,
        'Expired',
        '2025-05-01',
        '2025-08-01',
        3
    ),
    (
        504,
        'Tặng nước khi mua combo',
        0,
        'Active',
        '2025-05-01',
        '2025-12-01',
        4
    ),
    (
        505,
        'Giảm 50% cho đơn hàng',
        50,
        'Expired',
        '2025-05-01',
        '2025-08-01',
        5
    );
INSERT INTO Food (
        Food_ID,
        Food_name,
        Description,
        Category,
        Unit_price,
        Image_URL,
        Status
    )
VALUES (
        '101',
        'Bánh mì thịt',
        'Bánh mì kẹp thịt nóng',
        'Fast food',
        25000,
        'banhmi.jpg',
        'Còn hàng'
    ),
    (
        '102',
        'Phở bò',
        'Phở bò truyền thống',
        'Noodle',
        45000,
        'pho.jpg',
        'Còn hàng'
    ),
    (
        '103',
        'Cơm tấm sườn',
        'Cơm tấm sườn thơm ngon',
        'Rice',
        40000,
        'comtam.jpg',
        'Còn hàng'
    ),
    (
        '104',
        'Pepsi',
        'Nước giải khát',
        'Drink',
        10000,
        'pepsi.jpg',
        'Còn hàng'
    ),
    (
        '105',
        'Bún bò',
        'Bún bò Huế',
        'Noodle',
        40000,
        'bunbo.jpg',
        'Còn hàng'
    );
INSERT INTO Order_fooddy (
        Order_ID,
        Customer_ID_number,
        Food_ID,
        Log_ID,
        Payment_ID,
        Total_amount,
        Pick_up_status,
        QR_code,
        Price,
        Quantity,
        Voucher_ID,
        Order_time
    )
VALUES (
        9001,
        '621133675121',
        101,
        301,
        10,
        22500,
        'Picked',
        'QR9001',
        25000,
        1,
        501,
        '2025-10-27 12:00:00'
    ),
    (
        9002,
        '621133675222',
        102,
        302,
        11,
        36000,
        'Delivering',
        'QR9002',
        45000,
        1,
        502,
        '2025-10-27 13:00:00'
    ),
    (
        9003,
        '621133675323',
        103,
        303,
        12,
        40000,
        'Preparing',
        'QR9003',
        40000,
        1,
        NULL,
        '2025-10-28 14:00:00'
    ),
    (
        9004,
        '621133672424',
        104,
        304,
        13,
        40000,
        'Preparing',
        'QR9003',
        40000,
        1,
        NULL,
        '2025-10-28 14:00:00'
    ),
    (
        9005,
        '621133672355',
        105,
        305,
        14,
        40000,
        'Preparing',
        'QR9003',
        40000,
        1,
        NULL,
        '2025-10-28 14:00:00'
    );
INSERT INTO Transaction_log (Log_ID, Staff_ID_number, Action_time, Reason)
VALUES (
        301,
        '621133675424',
        '2025-10-27 12:10:00',
        'Hoàn tất thanh toán'
    ),
    (
        302,
        '621133675525',
        '2025-10-27 13:10:00',
        'Đang giao hàng'
    ),
    (
        303,
        '621133675626',
        '2025-10-28 14:15:00',
        'Đang chuẩn bị'
    ),
    (
        304,
        '621133675828',
        '2025-10-28 15:10:00',
        'Hoàn tất thanh toán'
    ),
    (
        305,
        '621133675929',
        '2025-10-29 20:10:00',
        'Hoàn tất thanh toán'
    );
INSERT INTO ApplicableBranch (Branch_ID, Voucher_ID)
VALUES (1, 501),
    (2, 502),
    (3, 503),
    (4, 503),
    (5, 503);
INSERT INTO Menu (Branch_ID, Shift, Date_menu)
VALUES (1, 'Morning', '2025-10-28'),
    (2, 'Evening', '2025-10-28'),
    (3, 'Afternoon', '2025-10-28'),
    (4, 'Afternoon', '2025-10-28'),
    (5, 'Afternoon', '2025-10-28'),
    (2, 'Morning', '2025-10-28'),
    (1, 'Afternoon', '2025-10-28'),
    (3, 'Evening', '2025-10-28');
INSERT INTO Has (Food_ID, Branch_ID)
VALUES (101, 1),
    (102, 2),
    (103, 3),
    (102, 3),
    (103, 2);
INSERT INTO Company (Company_ID, Company_name, Email, Phone_number)
VALUES (901, 'Công ty FvF', 'info@fvf.vn', '028999888'),
    (
        902,
        'Công ty NNN',
        'contact@NNN.vn',
        '028888777'
    ),
    (903, 'Công ty UYU', 'sales@uyu.vn', '028777666'),
    (904, 'Công ty IUI', 'sales@IuI.vn', '028742466'),
    (905, 'Công ty CDC', 'sales@CDC.vn', '0287434534');
INSERT INTO Batch (
        Batch_ID,
        Product_date,
        Batch_name,
        Quantity,
        Recived_date,
        Cost,
        Delivery_date,
        Company_ID,
        Food_ID,
        Branch_ID
    )
VALUES (
        701,
        '2025-10-01',
        'Lô bánh mì A',
        100,
        '2025-10-02',
        2000000,
        '2025-10-03',
        901,
        101,
        1
    ),
    (
        702,
        '2025-09-28',
        'Lô phở B',
        80,
        '2025-09-29',
        2500000,
        '2025-09-30',
        902,
        102,
        2
    ),
    (
        703,
        '2025-10-05',
        'Lô cơm tấm C',
        120,
        '2025-10-06',
        3000000,
        '2025-10-07',
        903,
        103,
        3
    ),
    (
        704,
        '2025-10-05',
        'Lô bún bò',
        120,
        '2025-10-06',
        3000000,
        '2025-10-07',
        904,
        105,
        4
    ),
    (
        705,
        '2025-10-05',
        'Lô pepsi',
        120,
        '2025-10-06',
        3000000,
        '2025-10-07',
        905,
        104,
        5
    );
INSERT INTO ServedFood (Food_ID)
VALUES (101),
    (102),
    (103),
    (104),
    (105);
INSERT INTO StockedFood (Food_ID, Expiry_date, Manufacture_date)
VALUES (101, '2025-12-30', '2025-10-01'),
    (102, '2025-12-15', '2025-09-28'),
    (103, '2025-12-25', '2025-10-05'),
    (104, '2025-12-15', '2025-09-28'),
    (105, '2025-12-15', '2025-09-28');
INSERT INTO Ingredient (
        Ingredient_ID,
        Ingredient_name,
        Quantity,
        Description_fooddy,
        Unit
    )
VALUES (
        801,
        'Thịt heo',
        50,
        'Nguyên liệu chính cho bánh mì',
        'kg'
    ),
    (802, 'Bánh mì', 100, 'Vỏ bánh mì tươi', 'ổ'),
    (803, 'Hành phi', 20, 'Gia vị', 'kg'),
    (
        804,
        'Thịt bò',
        50,
        'Nguyên liệu chính cho bún bò',
        'kg'
    ),
    (805, 'Phở', 50, 'Nguyên liệu chính phở', 'kg');
INSERT INTO Contain (Ingredient_ID, Batch_ID)
VALUES (801, 701),
    (802, 701),
    (803, 703),
    (804, 704),
    (805, 705);