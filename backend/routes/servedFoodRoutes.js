console.log(">>> Loaded servedFoodRoutes.js <<<");

const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const db = require("../dbConfig");
const multer = require("multer");

/* ===================== UPLOAD CONFIG ===================== */
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ===================== HELPER HANDLE ERROR ===================== */
function handleMysqlError(res, err) {
  if (!err) return;

  // Trigger / SIGNAL
  if (err?.sqlState === "45000") {
    return res.status(400).json({
      error: err.sqlMessage,
    });
  }

  // Foreign Key constraint
  if (err?.errno === 1451) {
    return res.status(409).json({
      error: "Không thể thực hiện do dữ liệu đang được sử dụng",
    });
  }

  return res.status(500).json({
    error: err.sqlMessage || err.message || "Lỗi hệ thống",
  });
}

/* ===================== GET FOODS ===================== */
router.get("/", async (req, res) => {
  const { branchId } = req.query;
  if (!branchId) return res.status(400).json({ error: "Thiếu branchId" });

  try {
    const [results] = await db.promise().query("CALL Get_Foods(?)", [branchId]);
    res.json(results[0]);
  } catch (err) {
    console.error("Get_Foods error:", err);
    handleMysqlError(res, err);
  }
});

/* ===================== ADD FOOD ===================== */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, quantity, branchId } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const priceNum = Number(price);
    const quantityNum = Number(quantity ?? 0);
    const branchIdNum = Number(branchId);

    if (
      !name?.trim() ||
      Number.isNaN(priceNum) ||
      !category?.trim() ||
      Number.isNaN(branchIdNum)
    ) {
      return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }

    // Thêm món ăn
    await db.promise().query(
      "CALL Add_Food(?, ?, ?, ?, ?, ?, @newFoodId)",
      [name.trim(), priceNum, imagePath, quantityNum, category.trim(), branchIdNum]
    );

    // Lấy Food_ID vừa thêm
    const [idRows] = await db.promise().query("SELECT @newFoodId AS Food_ID");
    const foodId = idRows[0]?.Food_ID;

    if (!foodId)
      return res.status(500).json({ error: "Không lấy được ID món ăn" });

    // Lấy dữ liệu món ăn vừa thêm
    const [rows] = await db
      .promise()
      .query("SELECT * FROM ServedFood WHERE Food_ID = ?", [foodId]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Add_Food error:", err);
    handleMysqlError(res, err);
  }
});

/* ===================== UPDATE FOOD ===================== */
router.patch("/:id", upload.single("image"), async (req, res) => {
  try {
    const foodId = req.params.id;
    const data = req.body || {};
    const imagePath = req.file ? `/uploads/${req.file.filename}` : data.image || "";

    await db
      .promise()
      .query("CALL Update_Food(?, ?, ?, ?, ?, ?)", [
        foodId,
        data.name,
        Number(data.price),
        Number(data.quantity),
        imagePath,
        data.category,
      ]);

    const [rows] = await db
      .promise()
      .query("SELECT * FROM ServedFood WHERE Food_ID = ?", [foodId]);

    res.json(rows[0]);
  } catch (err) {
    console.error("Update_Food error:", err);
    handleMysqlError(res, err);
  }
});

/* ===================== DELETE FOOD ===================== */
router.delete("/:id", async (req, res) => {
  try {
    const foodId = req.params.id;
    await db.promise().query("CALL Delete_Food(?)", [foodId]);

    res.status(200).json({ message: "Đã xóa món ăn thành công" });
  } catch (err) {
    console.error("Delete_Food error:", err);
    handleMysqlError(res, err);
  }
});

module.exports = router;
