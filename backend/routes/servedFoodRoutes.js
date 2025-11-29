console.log(">>> Loaded servedFoodRoutes.js version A <<<");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");

// Tạo folder uploads nếu chưa tồn tại
const express = require('express');
const router = express.Router(); 
const db = require('../dbConfig'); 

const multer = require("multer");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.get('/', (req, res) => {
  const { branchId } = req.query;

  let sql = `
    SELECT DISTINCT sf.*
    FROM ServedFood sf
    JOIN Has h ON h.Food_ID = sf.Food_ID
  `;
  const params = [];

  if (branchId) {
    sql += ' WHERE h.Branch_ID = ?';
    params.push(branchId);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Lỗi khi lấy dữ liệu Food' });
    }
    res.json(results);
  });
});

// 2. POST /food - Thêm món ăn mới
router.post('/', upload.single('image'), (req, res) => {
  const data = req.body || {};

  const name     = data.name || data.Food_name || null;
  const price    = data.price ?? data.Unit_price ?? null;
  const category = data.category || data.Category || null;
  const quantity = Number(data.quantity ?? data.Quantity ?? 0);
  const status   = data.status || data.Availability_status || "Available";
  const branchId = data.branchId || data.Branch_ID || null;

  const imagePath = req.file 
    ? `/uploads/${req.file.filename}`
    : data.image || data.Image || data.Image_URL || "";

  // Validate
  if (!name || price == null || !category) {
    return res.status(400).json({
      error: "Thiếu thông tin bắt buộc (name, price, category)"
    });
  }

  // Insert to ServedFood
  const insertFoodSQL = `
    INSERT INTO ServedFood
      (Food_name, Unit_price, Availability_status, Image, Quantity, Category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [name, price, status, imagePath, quantity, category];

  db.query(insertFoodSQL, params, (err, result) => {
    if (err) {
      console.error("Insert ServedFood error:", err);
      return res.status(500).json({ error: "Thêm món ăn thất bại" });
    }
    console.log("Insert OK, newFoodID =", result.insertId);
    const newFoodID = result.insertId;

    if (branchId) {
      const today = new Date().toISOString().slice(0, 10);
      const defaultShift = 'Sáng';
      const insertHasSQL = `
      INSERT INTO Has (Food_ID, Branch_ID, Shift, Date_menu)
      VALUES (?, ?, ?, ?)
    `;
      ddb.query(insertHasSQL, [newFoodID, branchId, defaultShift, today], (err2) => {
      if (err2) {
        console.error("Insert Has error:", err2);
        return res.status(500).json({ error: "Thêm món ăn vào menu thất bại" });
      }

      return res.status(201).json({
        message: "Thêm món ăn thành công và cập nhật menu",
        Food_ID: newFoodID,
        Food_name: name,
        Unit_price: price,
        Availability_status: status,
        Image: imagePath,
        Quantity: quantity,
        Category: category,
        Branch_ID: branchId,
        Shift: defaultShift,
        Date_menu: today
      });
    });
  }

  });
});

// PATCH /food/:id - Cập nhật món ăn
router.patch('/:id', upload.single('image'), (req, res) => {
  const foodId = req.params.id;
  const data = req.body || {};

  const name     = data.name || data.Food_name;
  const price    = data.price ?? data.Unit_price;
  const category = data.category || data.Category;
  const quantity = Number(data.quantity ?? data.Quantity);
  const status   = data.status || data.Availability_status;
  const imagePath = req.file 
    ? `/uploads/${req.file.filename}`
    : data.image || data.Image || data.Image_URL;

  const updateSQL = `
    UPDATE ServedFood
    SET Food_name = ?, Unit_price = ?, Availability_status = ?, Image = ?, Quantity = ?, Category = ?
    WHERE Food_ID = ?
  `;

  const params = [name, price, status, imagePath, quantity, category, foodId];

  db.query(updateSQL, params, (err, result) => {
    if (err) {
      console.error("Update ServedFood error:", err);
      return res.status(500).json({ error: "Cập nhật món ăn thất bại" });
    }
    res.json({ message: "Cập nhật món ăn thành công", Food_ID: foodId });
  });
});

// 3. DELETE /food/:id - Xóa món ăn
router.delete('/:id', (req, res) => {
  const foodId = req.params.id;

  db.query('DELETE FROM Food WHERE Food_ID = ?', [foodId], (err, result) => {
    if (err) {
      console.error("Lỗi DB:", err);
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