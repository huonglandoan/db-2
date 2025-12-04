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