const db = require("../dbConfig");

exports.calculateBranchRevenue = (branchId, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT Calculate_Branch_Revenue(?, ?, ?) AS revenue`;
    
    db.query(sql, [branchId, startDate, endDate], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].revenue || 0);
      }
    });
  });
};

exports.calculateBranchDiscountExpense = (branchId, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT Calculate_Branch_Discount_Expense(?, ?, ?) AS expense`;
    
    db.query(sql, [branchId, startDate, endDate], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].expense || 0);
      }
    });
  });
};