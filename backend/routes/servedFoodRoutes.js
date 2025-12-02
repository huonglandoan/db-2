console.log(">>> Loaded servedFoodRoutes.js <<<");

const fs = require("fs");
const path = require("path");
const express = require('express');
const router = express.Router(); 
const db = require('../dbConfig');
const multer = require("multer");

// Tạo folder uploads nếu chưa tồn tại
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  }
});
const upload = multer({ storage });


router.post('/', upload.single('image'), (req, res) => {
  const data = req.body || {};
  const name     = data.name;
  const price    = Number(data.price);
  const category = data.category;
  const quantity = Number(data.quantity ?? 0);
  const status   = data.status || "Còn hàng";
  const branchId = data.branchId;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

  if (!name || isNaN(price) || !category || !branchId) {
    return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
  }

  const sql = "CALL Add_Food(?, ?, ?, ?, ?, ?, ?, @newFoodId)";
  db.query(sql, [name, price, status, imagePath, quantity, category, branchId], (err) => {
    if (err) return res.status(500).json({ error: "Thêm món thất bại" });

    // Lấy chi tiết món ăn vừa thêm
    db.query("SELECT * FROM ServedFood ORDER BY Food_ID DESC LIMIT 1", (err2, rows) => {
      if (err2 || !rows[0]) return res.status(500).json({ error: "Không tìm thấy món ăn vừa thêm" });
      res.status(201).json(rows[0]);
    });
  });
});




router.patch('/:id', upload.single('image'), (req, res) => {
  const foodId = req.params.id;
  const data = req.body || {};
  const imagePath = req.file ? `/uploads/${req.file.filename}` : data.image || "";

  const sql = "CALL Update_Food(?, ?, ?, ?, ?, ?)";

  const params = [
    foodId,
    data.name,
    Number(data.price),
    Number(data.quantity),
    imagePath,
    data.category
  ];

  db.query(sql, params, (err) => {
    if (err) {
      console.error("Update_Food procedure error:", err);
      return res.status(500).json({ error: "Cập nhật món ăn thất bại" });
    }

    // Lấy lại món ăn vừa update để trả về frontend
    db.query("SELECT * FROM ServedFood WHERE Food_ID = ?", [foodId], (err2, rows) => {
      if (err2) return res.status(500).json({ error: "Lỗi lấy dữ liệu món ăn" });
      res.json(rows[0]);
    });
  });
});


router.delete('/:id', (req, res) => {
  const foodId = req.params.id;

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: "Không thể bắt đầu transaction" });

    // Xóa khỏi đơn hàng trước
    db.query('DELETE FROM Order_fooddy WHERE Food_ID = ?', [foodId], (err) => {
      if (err) return db.rollback(() => res.status(500).json({ error: "Không thể xóa khỏi đơn hàng" }));

      // Xóa khỏi menu (Has)
      db.query('DELETE FROM Has WHERE Food_ID = ?', [foodId], (err) => {
        if (err) return db.rollback(() => res.status(500).json({ error: "Không thể xóa khỏi menu" }));

        // Xóa món ăn
        db.query('DELETE FROM ServedFood WHERE Food_ID = ?', [foodId], (err) => {
          if (err) return db.rollback(() => res.status(500).json({ error: "Không thể xóa món ăn" }));

          db.commit(err => {
            if (err) return db.rollback(() => res.status(500).json({ error: "Lỗi commit" }));
            res.json({ message: `Đã xóa món ăn ID ${foodId}` });
          });
        });
      });
    });
  });
});


module.exports = router;
