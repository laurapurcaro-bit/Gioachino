const router = require("express").Router();
// middlewares
const { requireSignIn, isAdmin } = require("../middlewares/auth");
// controllers
const {
  register,
  login,
  secret,
} = require("../controllers/auth");

// 1: endpoint, 2: callback
router.post("/register", register);
router.post("/login", login);
router.get("/auth-check", requireSignIn, (req, res) => {
  res.json({ ok: true });
});
router.get("/admin-check", requireSignIn, isAdmin, (req, res) => {
  res.json({ ok: true });
});
// Protect routes so only logged in user have access to it
// Admin middleware
// testing
router.get("/secret", requireSignIn, isAdmin, secret);

module.exports = router;
