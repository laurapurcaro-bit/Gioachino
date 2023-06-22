require("dotenv").config();
const cookieSession = require("cookie-session");
const session = require("express-session");
const express = require("express");
const bodyParser = require("body-parser");
const {
  OAuthGoogle,
  OAuthFacebook,
  OAuthLinkedIn,
} = require("./oauth-strategy/passport");
const passport = require("passport");
const authRoutes = require("./routes/oauth");
const authEmailRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/user");
const mapsRoutes = require("./routes/maps");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const PORT = parseInt(process.env.PORT) || 8000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3000/"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);
// 1.
app.use(
  session({
    key: "userId",
    secret: process.env.SESS_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 * 1000, // 5 * 1000
      domain: "localhost",
      path: "/",
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);
//  2.
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
// 3.
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connected to db");
  });
mongoose.set("useCreateIndex", true);
// 4.
// Google OAuth
passport.use(OAuthGoogle);
// Facebook OAuth
passport.use(OAuthFacebook);
// LinkedIn OAuth
passport.use(OAuthLinkedIn);

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", authEmailRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", paymentRoutes);
app.use("/api", orderRoutes);
app.use("/api", mapsRoutes);

app.listen(PORT, () => {
  console.log(`server2 is running on port ${PORT}`);
});
