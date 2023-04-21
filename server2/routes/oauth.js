const router = require("express").Router();
const {
  loginSuccess,
  loginFailed,
  logout,
  googleAuth,
  googleAuthCallback,
  facebookAuth,
  facebookAuthCallback,
  facebookLogout,
  linkedinAuth,
  linkedinAuthCallback,
} = require("../controllers/oauth");

router.get("/auth/login/success", loginSuccess);

router.get("/auth/login/failed", loginFailed);

router.get("/auth/logout", logout);

// Google OAuth
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleAuthCallback);
// Facebook OAuth
router.get("/auth/facebook", facebookAuth);
router.get("/auth/facebook/callback", facebookAuthCallback);
router.post("/auth/facebook/logout", facebookLogout);
// LinkedIn OAuth
router.get("/auth/linkedin", linkedinAuth);
router.get("/auth/linkedin/callback", linkedinAuthCallback);

module.exports = router;
