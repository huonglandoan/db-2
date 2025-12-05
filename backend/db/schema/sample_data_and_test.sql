USE Fooddy;

SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO Branch (Address, Contact_number, Opening_hours, Branch_status, Manager_ID_number, Manager_start_date) VALUES
('123 Nguyễn Văn Cừ, Q5, HCM', '0901234567', '7:00-22:00', 'Hoạt động', '621133675424', '2023-01-01'),
('45 Lý Thường Kiệt, Q10, HCM', '0909876543', '8:00-21:00', 'Hoạt động', '621133672159', '2023-02-14'),
('12 Hai Bà Trưng, Q1, HCM', '0911222333', '6:30-23:00', 'Hoạt động', '621133672157', '2024-03-10'),
('689 Võ Thị Sáu, Q7, HCM', '0909876598', '8:00-21:00', 'Hoạt động', '621133672160', '2023-05-13'),
('699 Quang Trung, Q9, HCM', '0909800011', '8:00-21:00', 'Hoạt động', '621133672161', '2024-07-28');

INSERT INTO User_fooddy VALUES
('621133672156', 'Nguyễn Minh Tín', '1990-03-15', 'BK1', 'minhtin123@fooddy.vn', 'Quản lý', '0901141111', '2024-01-01', 'Bình thường'),
('621133672157', 'Trần Thị Huyền' , '1995-05-22', 'BK2', 'huenaaa1@fooddy.vn', 'Quản lý', '0902225622', '2024-02-01', 'Bình thường'),
('621133672159', 'Nguyễn Minh Tạ' , '2005-03-19', 'USSH1', 'minhtatata@fooddy.vn', 'Quản lý', '0901471111', '2024-01-01', 'Bình thường'),
('621133672160', 'Trần Lê Hà Yến' , '2004-08-11', 'USSH2', 'yenleha123456@fooddy.vn', 'Quản lý', '0907142222', '2024-02-01', 'Bình thường'),
('621133672161', 'Hồ Ngọc Hà', '2001-09-10', 'UIT', 'hahaha123@fooddy.vn', 'Quản lý', '0903333333', '2024-03-01', 'Bình thường'),
('621133672158', 'Nguyễn Minh Thư', '1998-09-10', 'BK1', 'minthu910@fooddy.vn', 'Nhân viên', '0908943333', '2024-03-01', 'Bình thường'),
('621133672200', 'Phạm Quốc Hưng', '1998-04-12', 'BK1', 'hunghp01@fooddy.vn', 'Nhân viên', '0904444441', '2024-03-05', 'Bình thường'),
('621133672201', 'Nguyễn Minh Khải', '1999-07-19', 'BK1', 'khainguyen99@fooddy.vn', 'Nhân viên', '0904444442', '2024-03-05', 'Bình thường'),
('621133672202', 'Trần Bảo Long', '2000-02-10', 'BK1', 'longbao2000@fooddy.vn', 'Nhân viên', '0904444443', '2024-03-05', 'Bình thường'),
('621133672203', 'Lê Thanh Tùng', '1997-10-05', 'BK1', 'tungle97@fooddy.vn', 'Nhân viên', '0904444444', '2024-03-05', 'Bình thường'),
('621133672204', 'Huỳnh Nhật Tân', '2001-12-01', 'BK2', 'tanhuynh01@fooddy.vn', 'Nhân viên', '0904444445', '2024-03-05', 'Bình thường'),
('621133672205', 'Đỗ Triệu Dương', '1996-03-14', 'BK2', 'duongtrieu96@fooddy.vn', 'Nhân viên', '0904444446', '2024-03-05', 'Bình thường'),
('621133672206', 'Nguyễn Hải Đăng', '1995-11-21', 'BK2', 'dangnguyen95@fooddy.vn', 'Nhân viên', '0904444447', '2024-03-05', 'Bình thường'),
('621133672207', 'Phan Nhật Nam', '2002-09-02', 'BK2', 'namphan02@fooddy.vn', 'Nhân viên', '0904444448', '2024-03-05', 'Bình thường'),
('621133672208', 'Bùi Võ Thiên', '1994-07-30', 'BK2', 'thienbuiv@fooddy.vn', 'Nhân viên', '0904444449', '2024-03-05', 'Bình thường'),
('621133672209', 'Lâm Hoàng Khang', '1993-01-22', 'USSH1', 'khanglam93@fooddy.vn', 'Nhân viên', '0904444450', '2024-03-05', 'Bình thường'),
('621133672210', 'Hồ Đức Huy', '2000-05-18', 'USSH1', 'huyhdd@fooddy.vn', 'Nhân viên', '0904444451', '2024-03-05', 'Bình thường'),
('621133672211', 'Đặng Xuân Sang', '1999-02-25', 'USSH1', 'sangdx@fooddy.vn', 'Nhân viên', '0904444452', '2024-03-05', 'Bình thường'),
('621133672212', 'Nguyễn Quang Hiếu', '2001-09-12', 'USSH1', 'hieuquang01@fooddy.vn', 'Nhân viên', '0904444453', '2024-03-05', 'Bình thường'),
('621133672213', 'Trương Tấn Tài', '1997-11-07', 'USSH1', 'taitruong97@fooddy.vn', 'Nhân viên', '0904444454', '2024-03-05', 'Bình thường'),
('621133672214', 'Võ Trung Dũng', '1998-03-09', 'USSH2', 'dungvo98@fooddy.vn', 'Nhân viên', '0904444455', '2024-03-05', 'Bình thường'),
('621133672215', 'Nguyễn Nhật Quang', '1996-06-10', 'USSH2', 'quangnn96@fooddy.vn', 'Nhân viên', '0904444456', '2024-03-05', 'Bình thường'),
('621133672216', 'Phạm Đức Hoàng', '1995-01-29', 'USSH2', 'hoangpd95@fooddy.vn', 'Nhân viên', '0904444457', '2024-03-05', 'Bình thường'),
('621133672217', 'Châu Tấn Lợi', '2003-02-14', 'USSH2', 'loitanchau@fooddy.vn', 'Nhân viên', '0904444458', '2024-03-05', 'Bình thường'),
('621133672218', 'Nguyễn Hữu Phúc', '1994-09-10', 'UIT', 'phuchn94@fooddy.vn', 'Nhân viên', '0904444459', '2024-03-05', 'Bình thường'),
('621133672219', 'Trần Quang Minh', '2002-04-03', 'UIT', 'minhquang02@fooddy.vn', 'Nhân viên', '0904444460', '2024-03-05', 'Bình thường'),
('621133672222', 'Trần Hoài Bảo', '1998-08-09', 'UIT', 'baotran98@fooddy.vn', 'Nhân viên', '0905555553', '2024-03-06', 'Bình thường'),
('621133672223', 'Nguyễn Mai Linh', '1997-02-17', 'UIT', 'linhmailinh@fooddy.vn', 'Nhân viên', '0905555554', '2024-03-06', 'Bình thường'),
('621133675121', 'Nguyễn Văn Linh', '2000-01-10', 'BK1', 'lindan@gmail.com', 'Khách hàng', '0901234567', '2024-03-01', 'Bình thường'),
('621133675122', 'Trần Thị Hà Linh', '1999-05-20', 'BK1', 'linlin11@gmail.com', 'Khách hàng', '0902234567', '2024-03-01', 'Bình thường'),
('621133675123', 'Lê Văn Quân', '2002-08-30', 'BK2', 'minwuan11111@gmail.com', 'Khách hàng', '0903234567', '2024-03-02', 'Bình thường'),
('621133672124', 'Tạ Quang Quân', '2008-08-31', 'BK2', 'quangquan2008@gmail.com', 'Khách hàng', '0903235436', '2024-03-02', 'Bình thường'),
('621133672155', 'Nguyên Long Hưng', '2006-02-27', 'USSH1', 'lonhungg@gmail.com', 'Khách hàng', '0903237694', '2024-03-02', 'Bình thường'),
('621133672220', 'Hồ Phước An', '2004-05-12', 'USSH2', 'anhophuoc@gmail.com', 'Khách hàng', '0905555551', '2024-03-06', 'Bình thường'),
('621133672221', 'Lê Mỹ Duyên', '2001-12-20', 'UIT', 'myduyen01@gmail.com', 'Khách hàng', '0905555552', '2024-03-06', 'Bình thường'),
('621133672224', 'Vũ Gia Hân', '2003-11-28', 'UIT', 'giahanvu@gmail.com', 'Khách hàng', '0905555555', '2024-03-06', 'Bình thường');

INSERT INTO Staff (ID_number, Salary, Hire_date, Branch_ID, Supervisior_ID_number) VALUES
('621133672156', 50000000, '2024-01-01', 1, NULL),
('621133672157', 50000000, '2024-02-01', 2, NULL),
('621133672159', 50000000, '2024-01-01', 3, NULL),
('621133672160', 50000000, '2024-02-01', 4, NULL),
('621133672161', 50000000, '2024-03-01', 5, NULL),
('621133672158', 2000000, '2024-03-01', 1, '621133672156'),
('621133672200', 2000000, '2024-03-05', 1, '621133672156'),
('621133672201', 2000000, '2024-03-05', 1, '621133672156'),
('621133672202', 2000000, '2024-03-05', 1, '621133672156'),
('621133672203', 2000000, '2024-03-05', 1, '621133672156'),
('621133672204', 2000000, '2024-03-05', 2, '621133672157'),
('621133672205', 2000000, '2024-03-05', 2, '621133672157'),
('621133672206', 2000000, '2024-03-05', 2, '621133672157'),
('621133672207', 2000000, '2024-03-05', 2, '621133672157'),
('621133672208', 2000000, '2024-03-05', 2, '621133672157'),
('621133672209', 2000000, '2024-03-05', 3, '621133672159'),
('621133672210', 2000000, '2024-03-05', 3, '621133672159'),
('621133672211', 2000000, '2024-03-05', 3, '621133672159'),
('621133672212', 2000000, '2024-03-05', 3, '621133672159'),
('621133672213', 2000000, '2024-03-05', 3, '621133672159'),
('621133672214', 2000000, '2024-03-05', 4, '621133672160'),
('621133672215', 2000000, '2024-03-05', 4, '621133672160'),
('621133672216', 2000000, '2024-03-05', 4, '621133672160'),
('621133672217', 2000000, '2024-03-05', 4, '621133672160'),
('621133672218', 2000000, '2024-03-05', 5, '621133672161'),
('621133672219', 2000000, '2024-03-05', 5, '621133672161'),
('621133672222', 2000000, '2024-03-06', 5, '621133672161'),
('621133672223', 2000000, '2024-03-06', 5, '621133672161');

INSERT INTO Customer (ID_number) VALUES
('621133675121'), ('621133675122'), ('621133675123'), ('621133672124'),
('621133672155'), ('621133672220'), ('621133672221'), ('621133672224');

INSERT INTO Shift_type (Shift, ID_number) VALUES
('Sáng', '621133672156'), ('Chiều', '621133672156'), ('Sáng', '621133672157'), ('Chiều', '621133672157'),
('Sáng', '621133672159'), ('Chiều', '621133672159'), ('Sáng', '621133672160'), ('Chiều', '621133672160'),
('Sáng', '621133672161'), ('Chiều', '621133672161'), ('Sáng', '621133672158'), ('Chiều', '621133672200'),
('Sáng', '621133672201'), ('Chiều', '621133672202'), ('Sáng', '621133672203'), ('Sáng', '621133672204'),
('Chiều', '621133672205'), ('Sáng', '621133672206'), ('Chiều', '621133672207'), ('Sáng', '621133672208'),
('Sáng', '621133672209'), ('Chiều', '621133672210'), ('Sáng', '621133672211'), ('Chiều', '621133672212'),
('Sáng', '621133672213'), ('Chiều', '621133672214'), ('Sáng', '621133672215'), ('Chiều', '621133672216'),
('Sáng', '621133672217'), ('Sáng', '621133672218'), ('Chiều', '621133672219'), ('Sáng', '621133672222'),
('Chiều', '621133672223');

INSERT INTO ServedFood (Food_ID, Food_name, Unit_price, Availability_status, Image, Quantity, Category) VALUES
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

INSERT INTO Ingredient (Ingredient_ID, Ingredient_name, Quantity, Description_fooddy, Unit) VALUES
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

INSERT INTO Company (Company_ID, Company_name, Email, Phone_number) VALUES
(1, 'Công ty TNHH Thực Phẩm ABC', 'contact@abcfood.vn', '0901234567'),
(2, 'Công ty Cổ phần Nông Sản XYZ', 'info@xyzagri.vn', '0912345678'),
(3, 'Công ty TNHH Gia Vị Việt', 'sales@viethubspice.vn', '0923456789'),
(4, 'Công ty Cổ phần Đồ Uống Fresh', 'support@freshdrink.vn', '0934567890'),
(5, 'Công ty TNHH Hải Sản Ocean', 'oceanseafood@vn.com', '0945678901');

INSERT INTO Batch (Batch_ID, Production_date, Batch_name, Quantity, Recived_date, Cost, Delivery_date, Company_ID, Branch_ID) VALUES
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

INSERT INTO Contain (Ingredient_ID, Batch_ID) VALUES
(1,1),(2,1), (3,2),(4,2), (5,3),(6,3), (7,4),(8,4), (9,5),(10,5),
(11,6),(12,6), (13,7),(14,7), (15,8),(16,8), (17,9),(18,9), (19,10),(20,10);

INSERT INTO Menu (Branch_ID, Shift, Date_menu) VALUES
(1, 'Sáng', '2025-11-24'), (1, 'Chiều', '2025-11-24'), (1, 'Sáng', '2025-11-25'), (1, 'Chiều', '2025-11-25'), (1, 'Sáng', '2025-11-26'), (1, 'Chiều', '2025-11-26'),
(2, 'Sáng', '2025-11-24'), (2, 'Chiều', '2025-11-24'), (2, 'Sáng', '2025-11-25'), (2, 'Chiều', '2025-11-25'),
(3, 'Sáng', '2025-11-24'), (3, 'Chiều', '2025-11-24'), (3, 'Sáng', '2025-11-25'), (3, 'Chiều', '2025-11-25'),
(4, 'Sáng', '2025-11-24'), (4, 'Chiều', '2025-11-24'), (5, 'Sáng', '2025-11-24'), (5, 'Chiều', '2025-11-24');

INSERT INTO Has (Food_ID, Branch_ID, Shift, Date_menu) VALUES
(1, 1, 'Sáng', '2025-11-24'), (2, 1, 'Sáng', '2025-11-24'), (3, 1, 'Chiều', '2025-11-24'), (4, 1, 'Chiều', '2025-11-24'), (5, 1, 'Chiều', '2025-11-24'), (6, 1, 'Chiều', '2025-11-24'),
(7, 2, 'Sáng', '2025-11-24'), (8, 2, 'Chiều', '2025-11-24'), (9, 2, 'Chiều', '2025-11-24'), (10, 2, 'Sáng', '2025-11-25'), (11, 2, 'Chiều', '2025-11-25'), (12, 2, 'Chiều', '2025-11-25'),
(13, 3, 'Sáng', '2025-11-24'), (14, 3, 'Chiều', '2025-11-24'), (15, 3, 'Chiều', '2025-11-24'), (16, 3, 'Sáng', '2025-11-25'), (17, 3, 'Chiều', '2025-11-25'),
(18, 4, 'Sáng', '2025-11-24'), (19, 4, 'Chiều', '2025-11-24'), (20, 4, 'Chiều', '2025-11-24'),
(1, 5, 'Sáng', '2025-11-24'), (2, 5, 'Chiều', '2025-11-24'), (3, 5, 'Sáng', '2025-11-24'), (4, 5, 'Chiều', '2025-11-24');

INSERT INTO Has_food(Food_ID, Branch_ID) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1),(21,1),(22,1),(23,1),
(6, 2), (7, 2), (8, 2), (9, 2), (10, 2),(23,2),(22,2),(24,2),
(11, 3), (12, 3), (13, 3), (14, 3), (15, 3),(25,3),(23,3),(24,3),
(16, 4), (17, 4), (18, 4), (19, 4),(25,4),(21,4),(24,4),
(20, 5), (1, 5), (2, 5), (3, 5),(21,5),(24,5),(23,5);

INSERT INTO Wallet (Wallet_ID, Customer_ID_number, Balance, Last_updated) VALUES
('WAL00001', '621133675121', 500000, '2025-11-24 09:00:00'),
('WAL00002', '621133675122', 500000, '2025-11-23 15:30:00'),
('WAL00003', '621133675123', 500000, '2025-11-22 12:15:00'),
('WAL00004', '621133672124', 200000, '2025-11-21 18:45:00'),
('WAL00005', '621133672155', 505000, '2025-11-20 08:20:00'),
('WAL00006', '621133672220', 520000, '2025-11-19 14:10:00'),
('WAL00007', '621133672221', 530000, '2025-11-18 11:05:00'),
('WAL00008', '621133672224', 590000, '2025-11-17 20:30:00');

INSERT INTO Payment (Payment_ID, Wallet_ID, Payment_type, Method, Time_stamp, Status_fooddy, Amount) VALUES
('PAY00001', 'WAL00001', 'Nạp tiền', 'Banking', '2025-11-20 09:00:00', 'Thành công', 500000.00),
('PAY00002', 'WAL00002', 'Thanh toán món ăn', 'Ví điện tử', '2025-11-21 12:30:00', 'Đang xử lý', 100000.00),
('PAY00003', 'WAL00003', 'Nạp tiền', 'VietQR', '2025-11-22 15:45:00', 'Thành công', 300000.00),
('PAY00004', 'WAL00004', 'Chuyển tiền nội bộ', 'Banking', '2025-11-23 10:15:00', 'Thành công', 100000.00),
('PAY00005', 'WAL00005', 'Thanh toán món ăn', 'Ví điện tử', '2025-11-23 18:00:00', 'Thành công', 75000.00),
('PAY00006', 'WAL00006', 'Nạp tiền', 'Banking', '2025-11-24 08:20:00', 'Thành công', 200000.00),
('PAY00007', 'WAL00007', 'Thanh toán món ăn', 'VietQR', '2025-11-24 11:10:00', 'Đang xử lý', 50000.00),
('PAY00008', 'WAL00008', 'Chuyển tiền nội bộ', 'Ví điện tử', '2025-11-24 14:50:00', 'Thất bại', 90000.00),
('PAY00009', 'WAL00001', 'Thanh toán món ăn', 'VietQR', '2025-11-24 16:30:00', 'Thành công', 150000.00),
('PAY00010', 'WAL00002', 'Nạp tiền', 'Banking', '2025-11-24 17:45:00', 'Thành công', 300000.00);

INSERT INTO Voucher (Voucher_ID, Description_voucher, Discount_value, Status_voucher, Date_start, Date_end, Branch_ID) VALUES
('VOU00501', 'Giảm 10% đơn hàng trên 100k', 10, 'Còn hiệu lực', '2025-10-05', '2025-10-31', 1),
('VOU00502', 'Giảm 20% cho thành viên mới', 20, 'Còn hiệu lực', '2025-11-01', '2025-11-30', 2),
('VOU00503', 'Tặng nước khi mua combo', 0 , 'Hết hạn', '2025-05-15', '2025-06-01', 3),
('VOU00504', 'Tặng nước khi mua combo', 0 , 'Còn hiệu lực', '2025-05-01', '2025-05-15', 4),
('VOU00505', 'Giảm 50% cho đơn hàng', 50, 'Hết hạn', '2025-06-01', '2025-06-21', 5);

INSERT INTO Transaction_log (Log_ID, Staff_ID_number, Action_time) VALUES
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

INSERT INTO Order_fooddy (Order_ID, Customer_ID_number, Food_ID, Log_ID, Payment_ID, Branch_ID, Pick_up_status, QR_code, Price, Quantity, Voucher_ID, Order_time) VALUES
('ORD00001', '621133675121', 1, 101, 'PAY00001', 1, 'Chưa nhận', 'QR0001', 50000.00, 1, NULL, '2025-11-24 09:10:00'),
('ORD00002', '621133675122', 2, 102, 'PAY00002', 1, 'Đã nhận', 'QR0002', 45000.00, 2, NULL, '2025-11-23 16:00:00'),
('ORD00003', '621133675123', 3, 103, 'PAY00003', 1, 'Đã hủy', 'QR0003', 40000.00, 1, NULL, '2025-11-22 12:30:00'),
('ORD00004', '621133672124', 4, 104, 'PAY00004', 2, 'Chưa nhận', 'QR0004', 30000.00, 2, NULL, '2025-11-21 19:00:00'),
('ORD00005', '621133672155', 6, 105, 'PAY00005', 2, 'Đã nhận', 'QR0005', 48000.00, 1, NULL, '2025-11-20 08:45:00'),
('ORD00006', '621133672220', 11, 106, 'PAY00006', 3, 'Chưa nhận', 'QR0006', 120000.00, 1, NULL, '2025-11-19 14:30:00'),
('ORD00007', '621133672221', 12, 107, 'PAY00007', 3, 'Đã nhận', 'QR0007', 95000.00, 1, NULL, '2025-11-18 11:20:00'),
('ORD00008', '621133672224', 15, 108, 'PAY00008', 4, 'Chưa nhận', 'QR0008', 150000.00, 1, NULL, '2025-11-17 21:00:00'),
('ORD00009', '621133675121', 16, 109, 'PAY00001', 4, 'Đã nhận', 'QR0009', 130000.00, 1, NULL, '2025-11-16 13:15:00'),
('ORD00010', '621133675122', 17, 110, 'PAY00002', 4, 'Chưa nhận', 'QR0010', 140000.00, 1, NULL, '2025-11-15 17:45:00');

SET FOREIGN_KEY_CHECKS = 1;

----- Test

-- 1. THÊM VOUCHER MỚI (Dùng mã VOUxxxxx)
INSERT INTO Voucher (Voucher_ID, Description_voucher, Discount_value, Status_voucher, Date_start, Date_end, Branch_ID)
VALUES
('VOU00506', 'KM 15% don hang moi CN1', 15.00, 'Còn hiệu lực', '2025-11-01', '2025-11-30', 1),
('VOU00507', 'KM 10% cho tat ca don hang CN2', 10.00, 'Còn hiệu lực', '2025-11-01', '2025-11-30', 2);

-- 2. THÊM LOG GIAO DỊCH (Log_ID là INT nên giữ nguyên số)
INSERT INTO Transaction_log (Log_ID, Staff_ID_number, Action_time)
VALUES
(111, '621133672158', '2025-11-21 10:00:00'),
(112, '621133672204', '2025-11-22 14:00:00'); 

-- 3. THÊM THANH TOÁN (Payment)
-- Sửa Payment_ID thành 'PAYxxxxx'
-- Sửa Wallet_ID thành 'WALxxxxx' (cho khớp với bảng Wallet)
INSERT INTO Payment (Payment_ID, Wallet_ID, Payment_type, Method, Time_stamp, Status_fooddy, Amount)
VALUES
('PAY00011', 'WAL00001', 'Thanh toán món ăn', 'Banking', '2025-11-21 10:05:00', 'Thành công', 85000.00),
('PAY00012', 'WAL00002', 'Thanh toán món ăn', 'Ví điện tử', '2025-11-22 14:05:00', 'Thành công', 54000.00);

-- 4. THÊM ĐƠN HÀNG (Order)
-- Sửa Order_ID thành 'ORDxxxxx'
-- Cập nhật Payment_ID và Voucher_ID theo mã chuỗi ở trên
INSERT INTO Order_fooddy (Order_ID, Customer_ID_number, Food_ID, Log_ID, Payment_ID, Branch_ID, Pick_up_status, QR_code, Price, Quantity, Voucher_ID, Order_time)
VALUES
-- Đơn 11: Có Voucher VOU00506, Thanh toán PAY00011
('ORD00011', '621133675121', 1, 111, 'PAY00011', 1, 'Đã nhận', 'QR0011', 85000.00, 2, 'VOU00506', '2025-11-21 10:00:00'),

-- Đơn 12: Có Voucher VOU00507, Thanh toán PAY00012
('ORD00012', '621133675122', 8, 112, 'PAY00012', 2, 'Đã nhận', 'QR0012', 54000.00, 1, 'VOU00507', '2025-11-22 14:00:00');

-- 5. Test số lần chuyển tiền trong 1 ngày
INSERT INTO Payment (Payment_ID, Wallet_ID, Payment_type, Method, Status_fooddy, Amount) VALUES
('PAY_T6_1', 'WAL00001', 'Chuyển tiền nội bộ', 'Banking', 'Thành công', 20000),
('PAY_T6_2', 'WAL00001', 'Chuyển tiền nội bộ', 'Banking', 'Thành công', 20000),
('PAY_T6_3', 'WAL00001', 'Chuyển tiền nội bộ', 'Banking', 'Thành công', 20000),
('PAY_T6_4', 'WAL00001', 'Chuyển tiền nội bộ', 'Banking', 'Thành công', 20000),
('PAY_T6_5', 'WAL00001', 'Chuyển tiền nội bộ', 'Banking', 'Thành công', 20000);

INSERT INTO Payment (Payment_ID, Wallet_ID, Payment_type, Method, Status_fooddy, Amount) VALUES
('PAY_T6_6', 'WAL00001', 'Chuyển tiền nội bộ', 'Banking', 'Thành công', 20000); -- Lỗi vượt quá 5 lần chuyển tiền trong 1 ngày

-- 6. Test tuổi của nhân viên
INSERT INTO User_fooddy (ID_number, Full_name, Date_of_birth, Unit, Email, Position_fooddy, Phone_number, Registration_day) 
VALUES ('000000000099', 'Baby cua anh', '2015-01-01', 'Mam Non', 'baby@example.com', 'Nhân viên', '0999999999', CURDATE());

INSERT INTO Staff (ID_number, Salary, Hire_date, Branch_ID, Supervisior_ID_number)
VALUES ('000000000099', 5000000, CURDATE(), 1, NULL); -- Lỗi tuổi của nhân viên không nằm từ 18 đến 60 tuổi

-- 7. Test thời hạn voucher
INSERT INTO Voucher (Voucher_ID, Description_voucher, Discount_value, Status_voucher, Date_start, Date_end, Branch_ID)
VALUES 
('VOU_0999', 'Voucher bạch nguyệt quang', 10, 'Còn hiệu lực', '2025-01-01', '2025-03-01', 1); -- Lỗi thời hạn của Voucher

-- 8. Test trạng thái chi nhánh khi đặt hàng
UPDATE Branch SET Branch_status = 'Đóng cửa' WHERE Branch_ID = 1;

INSERT INTO Order_fooddy (Order_ID, Customer_ID_number, Food_ID, Log_ID, Payment_ID, Branch_ID, Pick_up_status, Price, Quantity, Order_time)
VALUES
('ORD_1305', '621133675121', 1, 101, 'PAY00001', 1, 'Chưa nhận', 50000, 1, NOW()); -- Lỗi order tại chi nhánh đã đóng cửa

UPDATE Branch SET Branch_status = 'Hoạt động' WHERE Branch_ID = 1;

-- 9. Test liên quan đến số dư của ví
INSERT INTO User_fooddy (ID_number, Full_name, Date_of_birth, Unit, Email, Phone_number, Registration_day)
VALUES ('999999999999', 'Ngưu Ma Vương', '2000-01-01', 'Test_Lab', 'test_lab@fooddy.vn', '0999888777', CURDATE());

INSERT INTO Customer (ID_number) VALUES ('999999999999');

INSERT INTO Wallet (Wallet_ID, Customer_ID_number, Balance) 
VALUES ('WAL_TEST', '999999999999', 1000000);

SELECT Balance FROM Wallet WHERE Wallet_ID = 'WAL_TEST';

INSERT INTO Payment (Payment_ID, Wallet_ID, Payment_type, Method, Status_fooddy, Amount)
VALUES ('PAY_REF1', 'WAL_TEST', 'Thanh toán món ăn', 'Ví điện tử', 'Thành công', 100000);

SELECT 'Sau khi thanh toán' AS Trang_thai, Balance FROM Wallet WHERE Wallet_ID = 'WAL_TEST';

UPDATE Payment 
SET Status_fooddy = 'Thất bại' 
WHERE Payment_ID = 'PAY_REF1';

SELECT 'Sau khi hoàn tiền' AS Trang_thai, Balance FROM Wallet WHERE Wallet_ID = 'WAL_TEST'; -- Kỳ vọng 1 000 000 VND

INSERT INTO Payment (Payment_ID, Wallet_ID, Payment_type, Method, Status_fooddy, Amount)
VALUES ('PAY_FIX1', 'WAL_TEST', 'Thanh toán món ăn', 'Ví điện tử', 'Thành công', 50000);

UPDATE Payment 
SET Amount = 70000 
WHERE Payment_ID = 'PAY_FIX1';

SELECT 'Sau khi sửa giá' AS Trang_thai, Balance FROM Wallet WHERE Wallet_ID = 'WAL_TEST'; -- Kỳ vọng 930 000 VND

UPDATE Wallet SET Balance = 1000000 WHERE Wallet_ID = 'WAL_TEST';

INSERT INTO Payment (Payment_ID, Wallet_ID, Payment_type, Method, Status_fooddy, Amount)
VALUES ('PAY_FIX3', 'WAL_TEST', 'Thanh toán món ăn', 'Ví điện tử', 'Thành công', 100000);

UPDATE Payment 
SET Amount = 80000 
WHERE Payment_ID = 'PAY_FIX3';

SELECT 'Sau khi giảm giá' AS Trang_thai, Balance FROM Wallet WHERE Wallet_ID = 'WAL_TEST'; -- Kỳ vọng 920 000 VND