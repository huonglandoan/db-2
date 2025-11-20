const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// KẾT NỐI DATABASE
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'fooddy'
});

db.connect(err => {
  if (err) {
    console.log("Kết nối MySQL thất bại:", err);
  } else {
    console.log("Kết nối MySQL thành công!");
  }
});

app.get('/food', (req, res) => {
  db.query("SELECT * FROM Food", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Lỗi khi lấy dữ liệu Food" });
    }
    res.json(results);
  });
});


// file server.js đã sửa

// ... (Code app.use(cors()) và db.connect)

app.get('/food', (req, res) => { 
  // ... logic GET /food
}); 


app.post('/food', (req, res) => {
  const { Food_ID, Food_name, Description, Category, Unit_price, Image_URL, Status } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!Food_ID || !Food_name || !Category || !Unit_price) {
    return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
  }

  db.query( // <-- Đảm bảo câu lệnh này nằm trong POST
    "INSERT INTO Food (Food_ID, Food_name, Description, Category, Unit_price, Image_URL, Status) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [Food_ID, Food_name, Description || '', Category, Unit_price, Image_URL || '', Status || 'Còn hàng'],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Thêm món ăn thất bại" });
      }
      res.json({ message: "Thêm món ăn thành công!", insertId: result.insertId });
    }
  ); // <-- Kết thúc db.query
}); // <-- Đóng hàm app.post tại đây! ⭐️


// ⭐️ Đặt các endpoint độc lập SAU app.post
app.delete('/food/:id', (req, res) => {
    const foodId = req.params.id;
    // Thực hiện truy vấn DELETE
    db.query('DELETE FROM Food WHERE Food_ID = ?', [foodId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Lỗi khi xóa món ăn" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy món ăn" });
        }
        res.json({ message: `Đã xóa món ăn có ID: ${foodId}` });
    });
});

app.get('/menu-daily', (req, res) => {
    res.json([]); 
});

app.listen(3000, () => {
  console.log("Server chạy tại http://localhost:3000");
});