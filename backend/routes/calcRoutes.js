const express = require("express");
const router = express.Router();
const calcController = require("../controllers/calcController");

router.get("/revenue", calcController.getBranchRevenue); 
router.get("/low-stock", calcController.checkLowStock);

module.exports = router;