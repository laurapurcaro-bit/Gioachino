const passport = require("passport");
const jwt = require("jsonwebtoken");

const CLIENT_URL = "http://localhost:3000";

const loginSuccess = (req, res) => {
  const user = req.user;
  //   console.log(user);
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
      logout: false,
    });
  } else {
    // console.log(req.user);
    res.status(401).json({
      success: false,
      message: "user failed to authenticate.",
    });
  }
};

const loginFailed = (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate.",
  });
};

const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    // destroy session data
    res.clearCookie("userId", { path: "/" });
    res.status(200).redirect(CLIENT_URL);
  });
};

const googleAuth = passport.authenticate("google", {
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ],
});

const googleAuthCallback = passport.authenticate("google", {
  successRedirect: CLIENT_URL,
  failureRedirect: "/login/failed",
});

const facebookAuth = passport.authorize("facebook", {
  scope: ["public_profile", "email"],
});

const facebookAuthCallback = passport.authenticate("facebook", {
  successRedirect: CLIENT_URL,
  failureRedirect: "/login/failed",
});

const facebookLogout = (req, res) => {
  res.redirect(
    "https://www.facebook.com/logout.php?next=" +
      CLIENT_URL +
      "/logout&access_token=" +
      req.body["accessToken"]
  );
};

const linkedinAuth = passport.authenticate("linkedin", {
  scope: ["r_emailaddress", "r_liteprofile"],
});

const linkedinAuthCallback = passport.authenticate("linkedin", {
  successRedirect: CLIENT_URL,
  failureRedirect: "/login/failed",
});

module.exports = {
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
};
