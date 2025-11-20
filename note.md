./db/schema/fooddy.sql -> toàn bộ bảng dữ liệu
./db/procedures/crud_procedures.sql -> chứa insert/delete/ update (Lan)
./db/procedures/report_procedures.sql -> WHERE, GROUP BY, và HAVING Thủy 
./db/functions/calculation_functions.sql -> IF/ELSE, LOOP Linh

######--------------------------------##########
Lan
./routes/productRoutes.js -> Định nghĩa các API Endpoint
./controllers/productController.js -> Nhận yêu cầu (req), trích xuất dữ liệu, gọi Service Layer, và gửi phản hồi (res).
./services/crudService.js -> Logic nghiệp vụ đơn giản cho CRUD
./dataAccess/repositoryBase.js -> File nền tảng để thiết lập kết nối Database và có hàm chung executeQuery

######--------------------------------##########
Thủy 
./controllers/queryController.js	-> Xử lý yêu cầu HTTP cho các thao tác GET Danh sách và Tìm kiếm/Báo cáo. Gọi queryService.getProducts/getReports.

./services/queryService.js	-> Logic nghiệp vụ cho việc lọc, sắp xếp dữ liệu hiển thị, gọi productRepository.fetchList/fetchReports.

######--------------------------------##########
Linh
./controllers/calcController.js	-> Xử lý yêu cầu HTTP cho việc gọi hàm tính toán (2.4).
./services/calcService.js	-> Thực hiện logic gọi hàm DB và xử lý kết quả.