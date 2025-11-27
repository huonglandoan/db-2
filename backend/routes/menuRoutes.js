
// routes/menu.ts
const express = require("express");
const router = express.Router();
const db = require("../dbConfig"); // kết nối MySQL

// GET /menu?branchId=2
router.post('/', (req, res) => {
  const { branchId } = req.query;
  const { Branch_ID, Shift, Date_menu, foods } = req.body;

  if (!Branch_ID || !Shift || !Date_menu) {
    return res.status(400).json({ error: 'Thiếu dữ liệu bắt buộc' });
  }

  // Thêm vào bảng Menu
  const sqlMenu = `INSERT INTO Menu (Branch_ID, Shift, Date_menu) VALUES (?, ?, ?)`;
  db.query(sqlMenu, [Branch_ID, Shift, Date_menu], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Tạo menu thất bại' });
    }

    if (foods && foods.length > 0) {
      // Chèn món ăn vào Has, không cần quantity
      const values = foods.map(f => [f, Branch_ID, Shift, Date_menu]);
      const sqlHas = `INSERT INTO Has (Food_ID, Branch_ID, Shift, Date_menu) VALUES ?`;
      db.query(sqlHas, [values], (err2) => {
        if (err2) {
          console.error(err2);
          return res.status(500).json({ error: 'Thêm món vào menu thất bại' });
        }
        return res.status(201).json({ branchId: Branch_ID, shift: Shift, date: Date_menu, foods });
      });
    } else {
      return res.status(201).json({ branchId: Branch_ID, shift: Shift, date: Date_menu, foods: [] });
    }
  });
});


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
      h.quantity,
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
    ORDER BY m.Date_menu, m.Shift, h.Food_ID
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
          branchId: r.Branch_ID,
          shift: r.Shift,
          date: r.Date_menu,
          foods: []
        };
      }
      if (r.Food_ID) {
        menuMap[key].foods.push({
          foodId: r.Food_ID,
          name: r.Food_name,
          quantity: r.quantity,
          price: r.Unit_price,
          status: r.Availability_status,
          image: r.Image,
          category: r.Category
        });
      }
    });

    res.json(Object.values(menuMap));
  });
});

module.exports = router;
