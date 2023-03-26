require("dotenv").config();
const cookieSession = require("cookie-session");
const express = require("express");
const passportSetup = require("./passport");
const passport = require("passport");
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const port = 8000;

app.use(
  cookieSession({
    name: "session",
    keys: ["lama"],
    maxAge: 24 * 60 * 60 * 100, // 24 hours
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to db");
  });

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`server2 is running on port ${port}`);
});
