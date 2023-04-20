const express = require("express");
// Router function of express
const router = express.Router();
// controllers
const {
  getOrders,
  getAllOrders,
  ordersSearch,
  updateOrderStatus,
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
router.put(
  "/admin/order-update-status/:orderId",
  requireSignIn,
  isAdmin,
  updateOrderStatus
);

module.exports = router;
