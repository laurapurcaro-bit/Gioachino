const User = require("../models/user");
const { UserModelGoogle } = require("../models/userGoogle");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

/*
Things to do before saving user to db:
  * add validation
  * check if email is taken
  * hash password
*/

const register = async (req, res) => {
  // with async request use " try catch"
  try {
    // 1. desctructure name, email, password from req.body
    const { firstName, lastName, email, password } = req.body;
    // 2. all fields require validation
    // if no name
    console.log(req.body);
    if (!firstName.trim()) {
      return res.json({ error: "First name is required" });
    }
    if (!lastName.trim()) {
      return res.json({ error: "Last name is required" });
    }
    if (!email) {
      return res.json({ error: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.json({ error: "Password must be at least characters long" });
    }
    // if (!address || !address.trim()) {
    //   return res.json({ error: "Address is needed" });
    // }
    // 3. check if email is taken
    // you need await
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.json({ error: "Email already taken" });
    }
    // 4. hash password
    const hashedPassword = await hashPassword(password);
    // 5. register the user
    const user = await new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    // Save data to DB
    user.save();
    // 6. Create TOKEN, use id to be linked with user
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // 7. send response
    res.json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        shippingAddresses: user.shippingAddresses,
        billingAddresses: user.billingAddresses,
        role: user.role,
        provider: user.provider,
        phone: user.phone,
        _id: user._id,
      },
      token,
    });
  } catch (err) {
    console.log("Register " + err);
  }
};

const login = async (req, res) => {
  // with async request use " try catch"
  try {
    // 1. desctructure name, email, password from req.body
    const { email, password } = req.body;
    // 2. all fields require validation
    if (!email) {
      return res.json({ error: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.json({ error: "Password must be at least characters long" });
    }
    // 3. check if email is taken
    // you need await
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({ error: "User not found. Please sign up" });
    }
    // 4. compare password
    const matchPassword = await comparePassword(password, user.password);
    if (!matchPassword) {
      return res.json({ error: "wrong password" });
    }
    // 5. Create TOKEN, use id to be linked with user
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // 6. send response
    res.json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        shippingAddresses: user.shippingAddresses,
        billingAddresses: user.billingAddresses,
        role: user.role,
        provider: user.provider,
        phone: user.phone,
        _id: user._id,
      },
      token,
    });
  } catch (err) {
    console.log("Login " + err);
  }
};

const secret = async (req, res) => {
  res.json({ currentUser: req.user });
};

// handle google login


module.exports = {
  register,
  login,
  secret,
};
