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


// >>> GET: Lấy tất cả món ăn <<< 
router.get('/', (req, res) => {
  const sql = `SELECT * FROM ServedFood`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("GET error:", err);
      return res.status(500).json({ error: "Lỗi khi lấy dữ liệu Food" });
    }
    res.json(results);
  });
});


// >>> POST: Thêm món ăn mới <<< 
router.post('/', upload.single('image'), (req, res) => {
  const data = req.body || {};

  const name     = data.name || null;
  const price    = data.price ?? null;
  const category = data.category || null;
  const quantity = Number(data.quantity ?? 0);
  const status   = data.status || "Available";

  const imagePath = req.file 
    ? `/uploads/${req.file.filename}`
    : "";

  if (!name || price == null || !category) {
    return res.status(400).json({
      error: "Thiếu thông tin bắt buộc (name, price, category)"
    });
  }

  const sql = `
    INSERT INTO ServedFood
    (Food_name, Unit_price, Availability_status, Image, Quantity, Category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [name, price, status, imagePath, quantity, category];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Thêm món ăn thất bại" });
    }

    res.status(201).json({
      message: "Thêm món ăn thành công",
      Food_ID: result.insertId,
      Food_name: name,
      Unit_price: price,
      Availability_status: status,
      Image: imagePath,
      Quantity: quantity,
      Category: category
    });
  });
});


router.patch('/:id', upload.single('image'), (req, res) => {
  const foodId = req.params.id;
  const data = req.body || {};

  // Lấy món ăn hiện tại từ DB
  db.query('SELECT * FROM ServedFood WHERE Food_ID = ?', [foodId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ error: "Không tìm thấy món ăn" });
    }

    const current = results[0];

    const name     = data.name ?? current.Food_name;
    const price    = data.price ?? current.Unit_price;
    const category = data.category ?? current.Category;
    const quantity = Number(data.quantity ?? current.Quantity);
    const status   = data.status ?? current.Availability_status;
    const imagePath = req.file 
      ? `/uploads/${req.file.filename}`
      : current.Image; // giữ ảnh cũ nếu không upload mới

    const sql = `
      UPDATE ServedFood
      SET Food_name = ?, Unit_price = ?, Availability_status = ?, Quantity = ?, Category = ?
      ${req.file ? ", Image = ?" : ""}
      WHERE Food_ID = ?
    `;

    const params = [name, price, status, imagePath, quantity, category, foodId];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Update error:", err);
        return res.status(500).json({ error: "Cập nhật món ăn thất bại" });
      }

      res.json({
        Food_ID: foodId,
        Food_name: name,
        Unit_price: price,
        Availability_status: status,
        Image: imagePath,
        Quantity: quantity,
        Category: category
      });
    });
  });
});


// >>> DELETE: Xóa món ăn <<< 
router.delete('/:id', (req, res) => {
  const foodId = req.params.id;

  db.query('DELETE FROM ServedFood WHERE Food_ID = ?', [foodId], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ error: "Lỗi khi xóa món ăn" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    }
    res.json({ message: `Đã xóa món ăn có ID: ${foodId}` });
  });
});

module.exports = router;
