// routes/menu.ts
const express = require("express");
const router = express.Router();
const db = require("../dbConfig"); // kết nối MySQL

// GET /menu/available-foods?branchId=1 - Lấy món ăn đã từng có trong menu của chi nhánh
router.get("/available-foods", (req, res) => {
  const { branchId } = req.query;

  if (!branchId) {
    return res.status(400).json({ error: "branchId là bắt buộc" });
  }

  // Lấy các món đã từng có trong menu của chi nhánh này (từ bảng Has)
  // DISTINCT để tránh trùng lặp
  const sql = `
    SELECT DISTINCT
      sf.Food_ID,
      sf.Food_name,
      sf.Unit_price,
      sf.Availability_status,
      sf.Image,
      sf.Quantity,
      sf.Category
    FROM ServedFood sf
    INNER JOIN Has h ON sf.Food_ID = h.Food_ID
    WHERE h.Branch_ID = ?
      AND sf.Availability_status = 'Còn hàng'
    ORDER BY sf.Food_name
  `;

  db.query(sql, [branchId], (err, results) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: "Lỗi tải danh sách món ăn" });
    }
    res.json(results);
  });
});

// GET /menu/items?branchId=1&date=2025-11-24&shift=Sáng
// Lấy danh sách món trong menu của một ca cụ thể
router.get("/items", (req, res) => {
  const { branchId, date, shift } = req.query;

  if (!branchId || !date || !shift) {
    return res.status(400).json({ error: "Thiếu tham số: branchId, date, shift" });
  }

  const sql = `
    SELECT 
      h.Food_ID,
      f.Food_name,
      f.Unit_price,
      f.Availability_status,
      f.Image,
      f.Quantity,
      f.Category
    FROM Has h
    JOIN ServedFood f ON h.Food_ID = f.Food_ID
    WHERE h.Branch_ID = ? 
      AND h.Date_menu = ? 
      AND h.Shift = ?
    ORDER BY f.Food_name
  `;

  db.query(sql, [branchId, date, shift], (err, results) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: "Lỗi tải menu" });
    }
    res.json(results);
  });
});

// POST /menu - Tạo/cập nhật menu với transaction
router.post('/', (req, res) => {
  const { Branch_ID, Shift, Date_menu, foods } = req.body;

  if (!Branch_ID || !Shift || !Date_menu) {
    return res.status(400).json({ error: 'Thiếu dữ liệu bắt buộc' });
  }

  // Bắt đầu transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction begin error:", err);
      return res.status(500).json({ error: 'Lỗi khởi tạo transaction' });
    }

    // Bước 1: Kiểm tra và tạo Menu nếu chưa tồn tại
    const checkMenuSql = `SELECT * FROM Menu WHERE Branch_ID = ? AND Shift = ? AND Date_menu = ?`;
    db.query(checkMenuSql, [Branch_ID, Shift, Date_menu], (err, results) => {
      if (err) {
        return db.rollback(() => {
          console.error("Check menu error:", err);
          res.status(500).json({ error: 'Lỗi kiểm tra menu' });
        });
      }

      // Nếu chưa có Menu, tạo mới
      if (results.length === 0) {
        const insertMenuSql = `INSERT INTO Menu (Branch_ID, Shift, Date_menu) VALUES (?, ?, ?)`;
        db.query(insertMenuSql, [Branch_ID, Shift, Date_menu], (err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Insert menu error:", err);
              res.status(500).json({ error: 'Tạo menu thất bại' });
            });
          }
          proceedWithHas();
        });
      } else {
        proceedWithHas();
      }
    });

    // Bước 2: Xóa tất cả món cũ trong Has, sau đó thêm món mới
    function proceedWithHas() {
      // Xóa tất cả món cũ
      const deleteHasSql = `DELETE FROM Has WHERE Branch_ID = ? AND Shift = ? AND Date_menu = ?`;
      db.query(deleteHasSql, [Branch_ID, Shift, Date_menu], (err) => {
        if (err) {
          return db.rollback(() => {
            console.error("Delete Has error:", err);
            res.status(500).json({ error: 'Xóa món cũ thất bại' });
          });
        }

        // Thêm các món mới
        if (foods && foods.length > 0) {
          const values = foods.map(f => {
            const foodId = typeof f === 'object' ? f.foodId : f;
            return [foodId, Branch_ID, Shift, Date_menu];
          });

          const insertHasSql = `INSERT INTO Has (Food_ID, Branch_ID, Shift, Date_menu) VALUES ?`;
          db.query(insertHasSql, [values], (err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Insert Has error:", err);
                res.status(500).json({ error: 'Thêm món vào menu thất bại' });
              });
            }

            // Commit transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Commit error:", err);
                  res.status(500).json({ error: 'Lỗi lưu menu' });
                });
              }
              res.status(201).json({ 
                message: 'Lưu menu thành công',
                branchId: Branch_ID, 
                shift: Shift, 
                date: Date_menu, 
                foods 
              });
            });
          });
        } else {
          // Không có món nào, chỉ commit
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Commit error:", err);
                res.status(500).json({ error: 'Lỗi lưu menu' });
              });
            }
            res.status(201).json({ 
              message: 'Lưu menu thành công (không có món)',
              branchId: Branch_ID, 
              shift: Shift, 
              date: Date_menu, 
              foods: [] 
            });
          });
        }
      });
    }
  });
});

// GET /menu?branchId=2 - Giữ nguyên endpoint cũ để tương thích
router.get("/", (req, res) => {
  const { branchId } = req.query;

  if (!branchId) return res.status(400).json({ error: "branchId là bắt buộc" });

  const sql = `
    SELECT 
      m.Branch_ID,
      m.Shift,
      m.Date_menu,
      h.Food_ID,
      f.Food_name,
      f.Unit_price,
      f.Availability_status,
      f.Image,
      f.Category
    FROM Menu m
    LEFT JOIN Has h
      ON m.Branch_ID = h.Branch_ID
      AND m.Shift = h.Shift
      AND m.Date_menu = h.Date_menu
    LEFT JOIN ServedFood f
      ON h.Food_ID = f.Food_ID
    WHERE m.Branch_ID = ?
    ORDER BY m.Date_menu DESC, m.Shift, h.Food_ID
  `;

  db.query(sql, [branchId], (err, rows) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: "Lỗi tải menu" });
    }

    // Gom nhóm menu theo ca và ngày
    const menuMap = {};
    rows.forEach(r => {
      const key = `${r.Branch_ID}-${r.Shift}-${r.Date_menu}`;
      if (!menuMap[key]) {
        menuMap[key] = {
          Branch_ID: r.Branch_ID,
          Shift: r.Shift,
          Date_menu: r.Date_menu,
          foods: []
        };
      }
      if (r.Food_ID) {
        menuMap[key].foods.push({
          Food_ID: r.Food_ID,
          Food_name: r.Food_name,
          Unit_price: r.Unit_price,
          Availability_status: r.Availability_status,
          Image: r.Image,
          Category: r.Category
        });
      }
    });

    res.json(Object.values(menuMap));
  });
});

module.exports = router;