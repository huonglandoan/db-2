// server.js
const express = require('express');
const cors = require('cors');
// Không cần require mysql2 ở đây nữa

const app = express();
app.use(cors());
app.use(express.json());

require('./dbConfig'); 

const foodRoutes = require('./routes/servedFoodRoutes');
app.use('/food', foodRoutes);
const branchRoutes = require('./routes/branchRoutes');
app.use('/branch', branchRoutes);
const menuRoutes = require('./routes/menuRoutes');
app.use('/menu', menuRoutes);


app.listen(3000, () => {
  console.log("Server chạy tại http://localhost:3000");
});