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

exports.checkLowStockFoods = (branchId, threshold) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Check_Low_Stock_Foods(?, ?) AS message`;
        
        db.query(sql, [branchId, threshold], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0]?.message); 
            }
        });
    });
};

exports.calculateBranchTotalSalary = (branchId) => {
  return new Promise((resolove, reject) => {
    const sql = `SELECT Calculate_Branch_Total_Salary(?) AS totalSalary`;
    
    db.query(sql, [branchId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolove(results[0]?.totalSalary || 0);
      }
    });
  })
}
 