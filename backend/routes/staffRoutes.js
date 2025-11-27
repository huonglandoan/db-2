const express = require('express');
const router = express.Router(); // Khởi tạo Express Router
const db = require('../dbConfig'); // Nhập đối tượng kết nối DB
 
router.get('/', (req, res) => {
  const { branchId } = req.query;

  let sql = `
    SELECT DISTINCT sf.*
    FROM ServedFood sf
    JOIN Has h ON sf.Food_ID = h.Food_ID
  `;
  const params = [];

  if (branchId) {
    sql += " WHERE h.Branch_ID = ?";
    params.push(branchId);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Lỗi khi lấy dữ liệu Food" });
    }
    res.json(results);
  });
});

exports.createStaff = async (req, res) => {
    const { 
        id_number, full_name, dob, unit, email, position, phone, 
        salary, hire_date, branch_id, supervisor_id 
    } = req.body;
    
    const connection = await db.getConnection(); 
    try {
        await connection.beginTransaction();

        const userSql = `
            INSERT INTO User_fooddy (ID_number, Full_name, Date_of_birth, Unit, Email, Position_fooddy, Phone_number, Registration_day)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        await connection.query(userSql, [id_number, full_name, dob, unit, email, position, phone]);

        const staffSql = `
            INSERT INTO Staff (ID_number, Salary, Hire_date, Branch_ID, Supervisior_ID_number)
            VALUES (?, ?, ?, ?, ?)
        `;
        await connection.query(staffSql, [id_number, salary, hire_date, branch_id, supervisor_id || null]);
        
        await connection.commit(); // Hoàn thành Transaction
        res.status(201).json({ message: "Tạo nhân viên thành công." });

    } catch (error) {
        await connection.rollback();
        console.error("Lỗi khi tạo nhân viên:", error);
        res.status(500).json({ message: "Tạo nhân viên thất bại do lỗi database." });
    } finally {
        connection.release(); 
    }
};

module.exports = router;