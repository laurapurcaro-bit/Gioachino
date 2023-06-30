const express = require("express");
// Router function of express
const router = express.Router();
// controllers
const {
  getTotken,
  processPayment,
  sendEmailAfterPayment,
  configStripe,
  createPaymentIntent,
  webhook,
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

router.get("/stripe-config", configStripe);
router.post("/create-payment-intent", createPaymentIntent);
router.post("/webhook", webhook);

module.exports = router;
