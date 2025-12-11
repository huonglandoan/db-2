const db = require('../dbConfig'); // Đảm bảo có import kết nối DB
const calcService = require("../services/calcService");

exports.getBranchRevenue = async (req, res) => {
  try {
    const { branchId, startDate, endDate } = req.query;

    if (!branchId || !startDate || !endDate) {
      return res.status(400).json({ 
        error: "Thiếu tham số: branchId, startDate, endDate" 
      });
    }

    const revenue = await calcService.calculateBranchRevenue(
      parseInt(branchId),
      startDate,
      endDate
    );

    res.json({ 
      branchId: parseInt(branchId),
      startDate,
      endDate,
      revenue: parseFloat(revenue)
    });
  } catch (error) {
    console.error("Error calculating revenue:", error);
    res.status(500).json({ 
      error: error.message || "Lỗi tính toán doanh thu" 
    });
  }
};

exports.checkLowStock = async (req, res) => {
  try {
      const { branchId, threshold } = req.query;

      if (!branchId || !threshold) {
          return res.status(400).json({ error: "Thiếu tham số: branchId và threshold" });
      }

      const resultMessage = await calcService.checkLowStockFoods(
          parseInt(branchId),
          parseInt(threshold)
      );

      res.json({ message: resultMessage });
  } catch (error) {
      console.error("Error checking low stock:", error);
      res.status(500).json({ 
          error: error.message || error.sqlMessage || "Lỗi kiểm tra tồn kho" 
      });
  }
};

exports.getBranchTotalSalary = async (req, res) => {
  try {
    const { branchId } = req.query;

    if (!branchId) {
      return res.status(400).json({ 
        error: "Thiếu tham số: branchId" 
      });
    }

    const totalSalary = await calcService.calculateBranchTotalSalary(
      parseInt(branchId),
    );

    res.json({ 
      branchId: parseInt(branchId),
      totalSalary: parseFloat(totalSalary)
    });
  } catch (error) {
    console.error("Error calculating total salary:", error);
    res.status(500).json({ 
      error: error.message || "Lỗi tính toán tổng lương nhân viên" 
    });
  }
};

// Hàm xử lý logic gọi thủ tục GetTopSellingFoods
exports.getTopSellingFoods = async (req, res) => {
  console.log(">>> [DEBUG] Hàm getTopSellingFoods ĐÃ ĐƯỢC GỌI <<<");
    // 1. Lấy tham số từ Query String
    const { branchId, minQuantity } = req.query;

    if (!branchId || !minQuantity) {
        return res.status(400).json({ error: "Thiếu tham số: branchId và minQuantity" });
    }
    
    // Kiểm tra tính hợp lệ của số lượng
    const minQ = Number(minQuantity);
    if (isNaN(minQ) || minQ < 0) {
        return res.status(400).json({ error: "Tham số minQuantity không hợp lệ." });
    }

    // 2. Định nghĩa câu lệnh gọi Stored Procedure
    const sql = "CALL GetTopSellingFoods(?, ?)";
    const params = [Number(branchId), minQ]; // Truyền tham số

    try {
        // 3. Thực thi câu lệnh
        const [results] = await db.promise().query(sql, params);

        // Stored Procedure thường trả về mảng lồng nhau, kết quả thật nằm ở [0]
        // Trả về một mảng chứa Food_ID, Food_name, Total_Sold
        res.json(results[0]); 

    } catch (error) {
        console.error("Lỗi khi gọi GetTopSellingFoods:", error);
        // Sử dụng hàm xử lý lỗi chung (nếu có) hoặc xử lý trực tiếp
        if (error.sqlState === '45000') {
             return res.status(400).json({ error: error.sqlMessage });
        }
        res.status(500).json({ error: "Lỗi hệ thống khi tải báo cáo món ăn bán chạy." });
    }
};