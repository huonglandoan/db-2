// dbConfig.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'Fooddy'
});

db.connect(err => {
  if (err) {
    console.log("Kết nối MySQL thất bại:", err);
  } else {
    console.log("Kết nối MySQL thành công!");
  }
});

// ⭐️ Xuất (export) đối tượng kết nối DB
module.exports = db;