// routes/menu.ts
const express = require("express");
const router = express.Router();
const db = require("../dbConfig"); // kết nối MySQL

router.get("/available-foods", async (req, res) => {
  const { branchId } = req.query;
  
  if (!branchId) {
    return res.status(400).json({ error: "Thiếu branchId" });
  }

  try {
    const [results] = await db.promise().query("CALL Get_Foods_available(?)", [branchId]);
    
    res.json(results[0]); 
  } catch (err) {
    console.error("Get_Foods_available error:", err);
    handleMysqlError(res, err);
  }
});

router.get("/items", async (req, res) => { // ⭐️ Thêm async
  const { branchId, date, shift } = req.query;

  if (!branchId || !date || !shift) {
    return res.status(400).json({ error: "Thiếu tham số: branchId, date, shift" });
  }

  const sql = "CALL Get_Menu_Items(?, ?, ?)";
  const params = [branchId, date, shift];

  try {
    // ⭐️ Sử dụng db.promise().query và await ⭐️
    const [results] = await db.promise().query(sql, params);
    
    // Stored Procedure trả về mảng lồng nhau, kết quả nằm ở vị trí [0]
    res.json(results[0]); 
  } catch (err) {
    console.error("Get_Menu_Items error:", err);
    
    // Sử dụng hàm xử lý lỗi chung đã định nghĩa trong file (nếu có)
    handleMysqlError(res, err); 
    
  }
});

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

    // ⭐️ BƯỚC 1: Gọi SP để tạo Menu và XÓA món cũ trong Has ⭐️
    // Chúng ta không dùng db.promise() nữa, chỉ dùng db.query()
    const manageMenuSql = "CALL Manage_Menu_Base(?, ?, ?)";
    db.query(manageMenuSql, [Branch_ID, Shift, Date_menu], (err, results) => {
      if (err) {
        return db.rollback(() => {
          console.error("Manage_Menu_Base error:", err);
          res.status(500).json({ error: 'Lỗi quản lý menu cơ sở' });
        });
      }

      // BƯỚC 2: Thêm các món mới
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

          // BƯỚC 3: Commit transaction
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
  });
});
           

// GET /menu?branchId=2 - Tải toàn bộ lịch trình menu đã thiết lập
router.get("/", async (req, res) => {
  const { branchId } = req.query;

  if (!branchId) return res.status(400).json({ error: "branchId là bắt buộc" });

  try {
    // ⭐️ GỌI STORED PROCEDURE MỚI ⭐️
    const [results] = await db.promise().query("CALL Get_All_Branch_Menus(?)", [branchId]);
    const rows = results[0]; // Lấy mảng dữ liệu thực tế

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
  } catch (err) {
    console.error("Get_All_Branch_Menus error:", err);
    handleMysqlError(res, err);
  }
});

router.get("/items", async (req, res) => {
  const { branchId, date, shift } = req.query;

  if (!branchId || !date || !shift) {
    return res.status(400).json({ error: "Thiếu tham số: branchId, date, shift" });
  }

  // Khai báo lệnh gọi Stored Procedure
  const sql = "CALL Get_Menu_Items_Detail(?, ?, ?)";
  const params = [branchId, date, shift]; // Thứ tự tham số phải khớp với SP

  try {
    // Sử dụng db.promise().query và await
    const [results] = await db.promise().query(sql, params);
    
    res.json(results[0]); 
  } catch (err) {
    console.error("Get_Menu_Items_Detail error:", err);
    
    // Sử dụng hàm xử lý lỗi chung (giả sử nó có sẵn)
    if (typeof handleMysqlError === 'function') {
        handleMysqlError(res, err); 
    } else {
        res.status(500).json({ error: "Lỗi tải menu" });
    }
  }
});
module.exports = router;