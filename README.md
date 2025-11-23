# btl2_DB

## Giới thiệu

Dự án btl2_DB gồm hai phần chính: backend và frontend, hướng đến việc xây dựng một ứng dụng web sử dụng TypeScript, JavaScript, CSS và HTML. Toàn bộ mã nguồn được tổ chức rõ ràng nhằm tách biệt phần xử lý server (backend) và phần giao diện người dùng (frontend).

## Cấu trúc thư mục

- backend/
  - controllers/
  - dataAccess/
  - db/
  - routes/
  - services/
  - server.js
  - package.json
- frontend/
  - src/
  - index.html
  - vite.config.ts
  - package.json
- note.md (ghi chú hoặc mô tả thêm về dự án)
- package.json, package-lock.json (ở thư mục gốc)

## Công nghệ sử dụng

- **Backend:** Node.js (JavaScript)
- **Frontend:** TypeScript, Vite, HTML, CSS
- ....

## Cài đặt & chạy dự án

1. Clone repo
   ```bash
   git clone https://github.com/namlinh1801/btl2_DB.git
   cd btl2_DB
   ```
2. Cài đặt phụ thuộc cho backend và frontend:
   ```bash
   cd backend
   npm install
   node server.js

   cd frontend
   npm install 
   npm run dev
   ```
3. Truy cập địa chỉ được hiển thị trên terminal (thường là http://localhost:... cho frontend).
  
## Đóng góp

Mọi đóng góp, báo lỗi hoặc ý kiến cải tiến đều hoan nghênh! Vui lòng tạo Pull Request hoặc Issue.
