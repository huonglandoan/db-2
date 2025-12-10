USE Fooddy;

SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO Branch (Address, Contact_number, Opening_hours, Branch_status, Manager_ID_number, Manager_start_date) VALUES
('123 Nguyễn Văn Cừ, Q5, HCM', '0901234567', '7:00-22:00', 'Hoạt động', '621133672156', '2023-01-01'),
('45 Lý Thường Kiệt, Q10, HCM', '0909876543', '8:00-21:00', 'Hoạt động', '621133672159', '2023-02-14'),
('12 Hai Bà Trưng, Q1, HCM', '0911222333', '6:30-23:00', 'Hoạt động', '621133672157', '2024-03-10'),
('689 Võ Thị Sáu, Q7, HCM', '0909876598', '8:00-21:00', 'Hoạt động', '621133672160', '2023-05-13'),
('699 Quang Trung, Q9, HCM', '0909800011', '8:00-21:00', 'Hoạt động', '621133672161', '2024-07-28');

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

INSERT INTO Has_food(Food_ID, Branch_ID)
VALUES
-- BK1 (Branch 1)
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1),(21,1),(22,1),(23,1),

-- BK2 (Branch 2)
(6, 2), (7, 2), (8, 2), (9, 2), (10, 2),(23,2),(22,2),(24,2),

-- USSH1 (Branch 3)
(11, 3), (12, 3), (13, 3), (14, 3), (15, 3),(25,3),(23,3),(24,3),

-- USSH2 (Branch 4)
(16, 4), (17, 4), (18, 4), (19, 4),(25,4),(21,4),(24,4),

-- UIT (Branch 5)
(20, 5), (1, 5), (2, 5), (3, 5),(21,5),(24,5),(23,5);

SET FOREIGN_KEY_CHECKS = 1;

----- Test

USE Fooddy;

-- 1.1. Thêm Log giao dịch
INSERT INTO Transaction_log (Log_ID, Staff_ID_number, Action_time)
VALUES
(111, '621133672158', '2025-11-21 10:00:00'),
(112, '621133672204', '2025-11-22 14:00:00'); 

-- 1.2. Thêm Voucher hợp lệ
INSERT INTO Voucher (Voucher_ID, Description_voucher, Discount_value, Status_voucher, Date_start, Date_end, Branch_ID)
VALUES
(506, 'KM 15% don hang moi CN1', 15.00, 'Còn hiệu lực', '2025-11-01', '2025-11-30', 1),
(507, 'KM 10% cho tat ca don hang CN2', 10.00, 'Còn hiệu lực', '2025-11-01', '2025-11-30', 2);

-- 1.3. Thêm Thanh toán hợp lệ
INSERT INTO Payment (Payment_ID, Wallet_ID, Payment_type, Method, Time_stamp, Status_fooddy, Amount)
VALUES
(11, '00000001', 'Thanh toán món ăn', 'Banking', '2025-11-21 10:05:00', 'Thành công', 85000.00),
(12, '00000002', 'Thanh toán món ăn', 'Ví điện tử', '2025-11-22 14:05:00', 'Thành công', 54000.00);

-- 1.4. Thêm Đơn hàng hợp lệ
INSERT INTO Order_fooddy (Order_ID, Customer_ID_number, Food_ID, Log_ID, Payment_ID, Branch_ID, Pick_up_status, QR_code, Price, Quantity, Voucher_ID, Order_time)
VALUES
(11, '621133675121', 1, 111, 11, 1, 'Đã nhận', 'QR0011', 85000.00, 2, 506, '2025-11-21 10:00:00'),
(12, '621133675122', 8, 112, 12, 2, 'Đã nhận', 'QR0012', 54000.00, 1, 507, '2025-11-22 14:00:00');


-- Chuẩn bị User để test
INSERT INTO User_fooddy (ID_number, Full_name, Date_of_birth, Unit, Email, Phone_number, Registration_day)
VALUES ('999999999999', 'Ngưu Ma Vương', '2000-01-01', 'Test_Lab', 'test_lab@fooddy.vn', '0999888777', CURDATE());
INSERT INTO Customer (ID_number) VALUES ('999999999999');
INSERT INTO Wallet (Wallet_ID, Customer_ID_number, Balance) VALUES ('00000009', '999999999999', 1000000);

-- 2.1. Test hạn mức chuyển tiền (Max 5 lần/ngày)
-- Chèn 5 giao dịch thành công
INSERT INTO Payment (Payment_ID, Wallet_ID, Payment_type, Method, Status_fooddy, Amount) VALUES
(13, '00000009', 'Chuyển tiền nội bộ', 'Banking', 'Thành công', 20000),
(14, '00000009', 'Chuyển tiền nội bộ', 'Banking', 'Thành công', 20000),
(15, '00000009', 'Chuyển tiền nội bộ', 'Banking', 'Thành công', 20000),
(16, '00000009', 'Chuyển tiền nội bộ', 'Banking', 'Thành công', 20000),
(17, '00000009', 'Chuyển tiền nội bộ', 'Banking', 'Thành công', 20000);

-- Giao dịch thứ 6 sẽ báo lỗi
INSERT INTO Payment (Payment_ID, Wallet_ID, Payment_type, Method, Status_fooddy, Amount) 
VALUES (18, '00000009', 'Chuyển tiền nội bộ', 'Banking', 'Thành công', 20000); 

-- 2.2. Test Logic Hoàn tiền
INSERT INTO Payment (Payment_ID, Wallet_ID, Payment_type, Method, Status_fooddy, Amount)
VALUES (18, '00000009', 'Thanh toán món ăn', 'Ví điện tử', 'Thành công', 100000);
-- Check số dư phải giảm về 800k
SELECT 'Sau khi thanh toan' AS Trang_thai, Balance FROM Wallet WHERE Wallet_ID = '00000009';

UPDATE Payment SET Status_fooddy = 'Thất bại' WHERE Payment_ID = 18;
-- Check số dư phải hoàn về 900k
SELECT 'Sau khi hoan tien' AS Trang_thai, Balance FROM Wallet WHERE Wallet_ID = '00000009';

-- 2.3. Test Logic Sửa giá
INSERT INTO Payment (Payment_ID, Wallet_ID, Payment_type, Method, Status_fooddy, Amount)
VALUES (19, '00000009', 'Thanh toán món ăn', 'Ví điện tử', 'Thành công', 50000);
-- Check số dư giảm 50k -> còn 950k

UPDATE Payment SET Amount = 70000 WHERE Payment_ID = 'PAY_FIX1';
-- Check số dư giảm thêm 20k -> Còn 930k
SELECT 'Sau khi sua gia tang' AS Trang_thai, Balance FROM Wallet WHERE Wallet_ID = '00000009';

-- Reset số dư thành 1tr
UPDATE Wallet SET Balance = 1000000 WHERE Wallet_ID = '00000009';

INSERT INTO Payment (Payment_ID, Wallet_ID, Payment_type, Method, Status_fooddy, Amount)
VALUES (20, '00000009', 'Thanh toán món ăn', 'Ví điện tử', 'Thành công', 100000);
-- Check số dư giảm 100k -> còn 900k
SELECT Balance FROM Wallet WHERE Wallet_ID = '00000009';

UPDATE Payment SET Amount = 80000 WHERE Payment_ID = 20;
-- Check số dư được hoàn lại 20k -> còn 920k
SELECT 'Sau khi sua gia giam' AS Trang_thai, Balance FROM Wallet WHERE Wallet_ID = '00000009';

-- 2.5. Test ví không tồn tại
INSERT INTO Payment (Payment_ID, Wallet_ID, Payment_type, Amount)
VALUES (21, '00000010', 'Thanh toán món ăn', 10000); 

-- 2.6. Test số dư ví không đủ
-- Ví WAL_TEST đang có 920k, thử thanh toán 10 triệu
INSERT INTO Payment (Payment_ID, Wallet_ID, Payment_type, Amount)
VALUES (22, '00000009', 'Thanh toán món ăn', 10000000);

-- 3.1. Test tuổi nhân viên
INSERT INTO User_fooddy (ID_number, Full_name, Date_of_birth, Unit, Email, Position_fooddy, Phone_number, Registration_day) 
VALUES ('000000000099', 'Baby cua anh', '2015-01-01', 'Mam Non', 'baby@example.com', 'Nhân viên', '0999999999', CURDATE());

INSERT INTO Staff (ID_number, Salary, Hire_date, Branch_ID, Supervisior_ID_number)
VALUES ('000000000099', 5000000, CURDATE(), 1, NULL);

-- 3.2. Test ngày vào làm nhỏ hơn ngày đăng ký
INSERT INTO User_fooddy (ID_number, Full_name, Date_of_birth, Unit, Email, Position_fooddy, Phone_number, Registration_day) 
VALUES ('123456789012', 'Chill Guy', '2000-01-01', 'PPL', 'noemal@noemail.com', 'Nhân viên', '0912345678', DATE_ADD(CURDATE(), INTERVAL 1 DAY));

INSERT INTO Staff (ID_number, Salary, Hire_date, Branch_ID)
VALUES ('123456789012', 10000000, CURDATE(), 1);

-- 3.3. Test trùng ca làm việc
INSERT INTO Shift_type (Shift, ID_number) VALUES ('Sáng', '621133672156');

-- 3.4. Test UPDATE trùng ca làm việc
-- Chọn nhân viên '621133672158' đã có ca Sáng trong dữ liệu mẫu, gán thêm ca Chiều
INSERT INTO Shift_type (Shift, ID_number) VALUES ('Chiều', '621133672158'); 

UPDATE Shift_type 
SET Shift = 'Sáng' 
WHERE ID_number = '621133672158' AND Shift = 'Chiều';

DELETE FROM Shift_type WHERE ID_number = '621133672158' AND Shift = 'Chiều';

-- 4.1. Test thời hạn voucher > 30 ngày
INSERT INTO Voucher (Voucher_ID, Description_voucher, Discount_value, Status_voucher, Date_start, Date_end, Branch_ID)
VALUES (508, 'Voucher dai han', 10, 'Còn hiệu lực', '2025-01-01', '2025-03-01', 1); 

-- 4.2. Test đặt hàng khi chi nhánh ĐÓNG CỬA
UPDATE Branch SET Branch_status = 'Đóng cửa' WHERE Branch_ID = 1;

INSERT INTO Order_fooddy (Order_ID, Customer_ID_number, Food_ID, Log_ID, Payment_ID, Branch_ID, Pick_up_status, Price, Quantity, Order_time)
VALUES (13, '621133675121', 1, 101, 23, 1, 'Chưa nhận', 50000, 1, NOW()); 

-- Phục hồi lại trạng thái
UPDATE Branch SET Branch_status = 'Hoạt động' WHERE Branch_ID = 1;

-- 4.3. Test đặt quá số lượng cho phép
INSERT INTO Order_fooddy (Order_ID, Customer_ID_number, Food_ID, Branch_ID, Pick_up_status, Quantity)
VALUES (14, '621133675121', 1, 1, 'Chưa nhận', 21);