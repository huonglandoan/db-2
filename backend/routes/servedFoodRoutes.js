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


// GET: Lấy món ăn theo branch
router.get('/', (req, res) => {
  const branchId = req.query.branchId;
  if (!branchId) return res.status(400).json({ error: "Thiếu branchId" });

  const sql = `
    SELECT sf.*
    FROM ServedFood sf
    WHERE sf.Food_ID IN (
      SELECT Food_ID
      FROM Has_food
      WHERE Branch_ID = ?
    )
  `;

  db.query(sql, [branchId], (err, results) => {
    if (err) {
      console.error("GET error:", err);
      return res.status(500).json({ error: "Lỗi khi lấy dữ liệu Food" });
    }

    console.log("foods returned:", results);
    res.json(results);
  });
});


router.post('/', upload.single('image'), (req, res) => {
  const data = req.body || {};

  const name     = data.name;
  const price    = Number(data.price);
  const category = data.category;
  const quantity = Number(data.quantity ?? 0);
  const status   = data.status || "Còn hàng";
  const branchId = data.branchId;

  const imagePath = req.file
    ? `/uploads/${req.file.filename}`
    : "";

  if (!name || isNaN(price) || !category || !branchId) {
    return res.status(400).json({
      error: "Thiếu thông tin bắt buộc (name, price, category, branchId)"
    });
  }

  // 1️⃣ Thêm món
  const insertFoodSql = `
    INSERT INTO ServedFood
    (Food_name, Unit_price, Availability_status, Image, Quantity, Category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(insertFoodSql,
    [name, price, status, imagePath, quantity, category],
    (err, result) => {
      if (err) {
        console.error("Insert ServedFood error:", err);
        return res.status(500).json({ error: "Thêm món ăn thất bại" });
      }

      const foodId = result.insertId;

      // 2️⃣ Gán món cho chi nhánh
      const insertHasFoodSql = `
        INSERT INTO Has_food (Food_ID, Branch_ID)
        VALUES (?, ?)
      `;

      db.query(insertHasFoodSql, [foodId, branchId], (err2) => {
        if (err2) {
          console.error("Insert Has_food error:", err2);
          return res.status(500).json({ error: "Không gán được món cho chi nhánh" });
        }

        res.status(201).json({
          message: "Thêm món ăn thành công",
          Food_ID: foodId,
          Branch_ID: branchId
        });
      });
    }
  );
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


    const params = req.file
  ? [name, price, status, quantity, category, imagePath, foodId]
  : [name, price, status, quantity, category, foodId];

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
