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

router.get('/', (req, res) => {
  const branchId = req.query.branchId;
  if (!branchId) return res.status(400).json({ error: "Thiếu branchId" });

  db.query("CALL Get_Foods(?)", [branchId], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi tải món ăn" });
    res.json(results[0]);
  });
});



router.post('/', upload.single('image'), (req, res) => {
  const { name, price, category, quantity, branchId } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

  if (!name || !price || !category || !branchId) {
    return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
  }

  const sql = "CALL Add_Food(?, ?, ?, ?, ?, ?, @newFoodId)";
  const params = [name, Number(price), imagePath, Number(quantity || 0), category, Number(branchId)];

  db.query(sql, params, (err) => {
    if (err) {
      console.error("Add_Food procedure error:", err);
      return res.status(500).json({ error: "Thêm món thất bại" });
    }

    db.query("SELECT @newFoodId AS Food_ID", (err2, result) => {
      if (err2) return res.status(500).json({ error: "Lấy ID thất bại" });
      const foodId = result[0]?.Food_ID;
      if (!foodId) return res.status(500).json({ error: "Không tìm thấy món ăn vừa thêm" });

      db.query("SELECT * FROM ServedFood WHERE Food_ID = ?", [foodId], (err3, rows) => {
        if (err3 || !rows[0]) return res.status(500).json({ error: "Không tìm thấy món ăn vừa thêm" });
        res.status(201).json(rows[0]);
      });
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


router.delete('/:id', async (req, res) => {
  const foodId = req.params.id;

  try {
    const [result] = await db.promise().query(
      "CALL Delete_Food(?);",
      [foodId]
    );

    res.status(200).json({
      message: "Đã xóa món ăn thành công",
      result
    });

  } catch (err) {
    console.error("Lỗi khi xóa:", err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
});

module.exports = router;
