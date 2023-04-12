const express = require("express");
// Router function of express
const router = express.Router();
// controllers
const { getTotken, processPayment } = require("../controllers/payment");

// Payment routes
router.get("/braintree/token", getTotken);
router.post("/braintree/payment", processPayment);

module.exports = router;
