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

exports.getBranchDiscountExpense = async (req, res) => {
  try {
    const { branchId, startDate, endDate } = req.query;

    if (!branchId || !startDate || !endDate) {
      return res.status(400).json({ 
        error: "Thiếu tham số: branchId, startDate, endDate" 
      });
    }

    const expense = await calcService.calculateBranchDiscountExpense(
      parseInt(branchId),
      startDate,
      endDate
    );

    res.json({ 
      branchId: parseInt(branchId),
      startDate,
      endDate,
      discountExpense: parseFloat(expense)
    });
  } catch (error) {
    console.error("Error calculating discount expense:", error);
    res.status(500).json({ 
      error: error.message || "Lỗi tính toán chi phí giảm giá" 
    });
  }
};