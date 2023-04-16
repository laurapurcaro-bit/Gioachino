const express = require("express");
// Router function of express
const router = express.Router();
// controllers
const {
  getOrders,
  getAllOrders,
  ordersSearch,
} = require("../controllers/orders");
// middlewares
const { requireSignIn, isAdmin } = require("../middlewares/auth");

// Payment routes
router.post("/orders", requireSignIn, getOrders);
// Admin routes
router.get("/admin/orders", requireSignIn, isAdmin, getAllOrders);
router.get(
  "/admin/orders/search/:search",
  requireSignIn,
  isAdmin,
  ordersSearch
);

module.exports = router;
