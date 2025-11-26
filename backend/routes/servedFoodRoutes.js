// routes/foodRoutes.js
const express = require('express');
const router = express.Router(); // Khởi tạo Express Router
const db = require('../dbConfig'); // Nhập đối tượng kết nối DB

// 1. GET /food - Lấy tất cả món ăn
router.get('/', (req, res) => {
  // Lưu ý: Tên bảng trong DB là ServedFood
  db.query("SELECT * FROM ServedFood", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Lỗi khi lấy dữ liệu Food" });
    }
    res.json(results);
  });
});

// 2. POST /food - Thêm món ăn mới
router.post('/', (req, res) => {
  const { Food_ID, Food_name, Quantity, Category, Unit_price, Image_URL, Status } = req.body;

  if (!Food_ID || !Food_name || !Category || !Unit_price) {
    return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
  }

  // Lưu ý: Tên bảng trong DB là ServedFood
  db.query(
    `INSERT INTO ServedFood 
   (Food_ID, Food_name, Unit_price, Availability_status, Image, Quantity, Category) 
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
    Food_ID,
    Food_name,
    Unit_price,
    Status || 'Còn hàng',  // Availability_status
    Image_URL || '',        // Image
    Quantity || 0,
    Category
  ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Thêm món ăn thất bại" });
      }
      res.json({ message: "Thêm món ăn thành công!", insertId: result.insertId });
    }
  );
});

// 3. DELETE /food/:id - Xóa món ăn
router.delete('/:id', (req, res) => {
  const foodId = req.params.id;
  
  // Lưu ý: Tên bảng trong DB là ServedFood
  db.query('DELETE FROM ServedFood WHERE Food_ID = ?', [foodId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Lỗi khi xóa món ăn" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    }
    res.json({ message: `Đã xóa món ăn có ID: ${foodId}` });
  });
});

// ⭐️ Xuất (export) router
module.exports = router;