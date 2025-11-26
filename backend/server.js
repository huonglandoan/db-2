// server.js
const express = require('express');
const cors = require('cors');
// Không cần require mysql2 ở đây nữa

const app = express();
app.use(cors());
app.use(express.json());

// ⭐️ 1. Nhập kết nối DB từ dbConfig
require('./dbConfig'); // Lệnh này chạy file dbConfig.js để thiết lập kết nối

// ⭐️ 2. Nhập tệp route
const foodRoutes = require('./routes/servedFoodRoutes');

app.use('/food', foodRoutes);

app.get('/menu-daily', (req, res) => {
    // Logic cho /menu-daily
    res.json([]); 
});

app.listen(3000, () => {
  console.log("Server chạy tại http://localhost:3000");
});