const express = require("express");
// Router function of express
const router = express.Router();
// controllers
const { getOrders } = require("../controllers/orders");
// middlewares
const { requireSignIn } = require("../middlewares/auth");

// Payment routes
router.post("/orders", requireSignIn, getOrders);

module.exports = router;
