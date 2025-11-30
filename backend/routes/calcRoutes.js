const express = require("express");
const router = express.Router();
const calcController = require("../controllers/calcController");

// GET /calc/revenue?branchId=1&startDate=2025-01-01&endDate=2025-01-31
router.get("/revenue", calcController.getBranchRevenue);

// GET /calc/discount-expense?branchId=1&startDate=2025-01-01&endDate=2025-01-31
router.get("/discount-expense", calcController.getBranchDiscountExpense);

module.exports = router;