const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const CLIENT_URL = "http://localhost:3000";

router.get("/auth/login/success", (req, res) => {
  const user = req.user;
  console.log(user);
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      token: token,
      cookies: req.cookies,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "user failed to authenticate.",
    });
  }
});

router.get("/auth/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate.",
  });
});

router.get("/auth/logout", (req, res, next) => {
  req.session.destroy(function (e) {
    req.logout();
  });
  res.redirect(CLIENT_URL);
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);
// router.get(
//   "/auth/google/callback",
//   passport.authenticate(
//     "google",
//     {
//       session: false,
//     },
//     (req, res) => {
//       res.set({ "Access-Control-Allow-Origin": "*" });
//       res.send(req.user);
//     }
//   )
// );

router.get(
  "/auth/facebook",
  passport.authorize("facebook", { scope: ["public_profile", "email"] })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.post("/auth/facebook/logout", function (req, res) {
  res.redirect(
    "https://www.facebook.com/logout.php?next=" +
      CLIENT_URL +
      "/logout&access_token=" +
      req.body["accessToken"]
  );
});

router.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", {
    scope: ["r_emailaddress", "r_liteprofile"],
  })
);

router.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

module.exports = router;
