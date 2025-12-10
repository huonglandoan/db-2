const express = require('express');
const router = express.Router();
const db = require('../dbConfig');

// Chuẩn hóa status ENUM từ DB sang "active" / "inactive"
function normalizeStatus(dbStatus) {
  if (!dbStatus) return "inactive";
  const s = String(dbStatus).toLowerCase();
  return s === "active" ? "active" : "inactive";
}

/* =========================
   GET: Lấy tất cả chi nhánh
   ========================= */
router.get('/', (req, res) => {
  const sql = `
    SELECT
      b.Branch_ID,
      b.Address,
      b.Contact_number,
      b.Opening_hours,
      b.Branch_status,
      b.Manager_ID_number,
      u.Full_name AS Manager_name
    FROM Branch b
    LEFT JOIN Staff s
      ON b.Manager_ID_number = s.ID_number
    LEFT JOIN User_fooddy u
      ON s.ID_number = u.ID_number
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: err.message });
    }

    const mapped = results.map(r => ({
      id: String(r.Branch_ID),
      address: r.Address,
      phone: r.Contact_number,
      opening_hour: r.Opening_hours,
      status: normalizeStatus(r.Branch_status),

      // manager
      manager_id: r.Manager_ID_number ?? "",
      manager_name: r.Manager_name ?? ""
    }));

    res.json(mapped);
  });
});


/* =========================
   GET: Lấy chi nhánh theo ID
   ========================= */
router.get('/', (req, res) => {
  const sql = `
    SELECT Branch_ID, Address, Contact_number, Opening_hours, Branch_status, Manager_ID_number
    FROM Branch
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB ERROR:", err); // log chi tiết
      return res.status(500).json({ error: err.message });
    }

    console.log("BRANCH RESULTS:", results); // log dữ liệu ra console backend

    const mapped = results.map(r => ({
      id: String(r.Branch_ID),
      address: r.Address,
      phone: r.Contact_number,
      manager: r.Manager_ID_number ?? "",
      status: ['Active', 'Inactive'].includes(r.Branch_status) ? r.Branch_status.toLowerCase() : 'inactive',
      opening_hour: r.Opening_hours
    }));

    res.json(mapped);
  });
});


/* =========================
   POST: Thêm chi nhánh mới
   ========================= */
router.post('/', (req, res) => {
  const {
    Branch_ID,
    Address,
    Contact_number,
    Opening_hours,
    Branch_status,
    Manager_ID_number,
    Manager_start_date
  } = req.body;

  const sql = `
    INSERT INTO Branch
    (Branch_ID, Address, Contact_number, Opening_hours, Branch_status,
     Manager_ID_number, Manager_start_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      Branch_ID,
      Address,
      Contact_number,
      Opening_hours,
      Branch_status,
      Manager_ID_number,
      Manager_start_date
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Branch created successfully' });
    }
  );
});

/* =========================
   PUT: Cập nhật chi nhánh
   ========================= */
router.put('/:id', (req, res) => {
  const fields = req.body;
  const updateClauses = [];
  const values = [];

  for (const key in fields) {
    if (fields[key] !== undefined) {
      updateClauses.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }

  if (updateClauses.length === 0) {
    return res.status(400).json({ message: 'No fields to update provided' });
  }

  const sql = `UPDATE Branch SET ${updateClauses.join(', ')} WHERE Branch_ID = ?`;
  values.push(req.params.id);

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Branch not found' });

    res.json({ message: 'Branch updated successfully' });
  });
});

/* =========================
   DELETE: Xóa chi nhánh
   ========================= */
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM Branch WHERE Branch_ID = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Branch not found' });

    res.json({ message: 'Branch deleted successfully' });
  });
});

module.exports = router;
