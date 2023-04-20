const express = require("express");
// Router function of express
const router = express.Router();
// controllers
const {
  getTotken,
  processPayment,
  sendEmailAfterPayment,
} = require("../controllers/payment");
// middlewares
const { requireSignIn } = require("../middlewares/auth");

// Payment routes
router.get("/braintree/token", getTotken);
router.post("/braintree/payment", requireSignIn, processPayment);
router.post(
  "/payment-success/send-email",
  requireSignIn,
  sendEmailAfterPayment
);

module.exports = router;
