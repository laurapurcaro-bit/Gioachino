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
  console.log("IMPORTED REGISTER CONTROLLER");
  // with async request use " try catch"
  try {
    // 1. desctructure name, email, password from req.body
    console.log("REGISTER", req.body);
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
        role: user.role,
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
        address: user.address,
        role: user.role,
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
// no change password if user login with google
const updateProfile = async (req, res) => {
  try {
    console.log("PROFILE UPDATE", req.user);
    if (req.body.provider === "google") {
      const { firstName, lastName, address, CAP, city, country } = req.body;
      console.log("PROFILE! UPDATE", req.body);
      const user = await UserModelGoogle.findById({ _id: req.user._id });
      // update user
      const updated = await UserModelGoogle.findOneAndUpdate(
        req.user._id,
        {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          address: address || user.address,
          CAP: CAP || user.CAP,
          city: city || user.city,
          country: country || user.country,
        },
        // get updated data
        { new: true }
      );
      // send response
      res.json(updated);
    } else {
      const { firstName, lastName, password, address, CAP, city, country } =
        req.body;
      console.log("PROFILE UPDATE", req.body);
      const user = await User.findById({ _id: req.user._id });
      // check password length
      if (password && password.length < 6) {
        return res.json({
          error: "Password must be at least 6 characters long",
        });
      }
      // hash password
      const hashedPassword = password
        ? await hashPassword(password)
        : undefined;
      // update user
      const updated = await User.findOneAndUpdate(
        req.user._id,
        {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          password: hashedPassword || user.password,
          address: address || user.address,
          CAP: CAP || user.CAP,
          city: city || user.city,
          country: country || user.country,
        },
        // get updated data
        { new: true }
      );
      // remove password from response
      updated.password = undefined;
      // send response
      res.json(updated);
    }
  } catch (err) {
    console.log("PROFILE UPDATE ERROR", err);
  }
};

module.exports = {
  register,
  login,
  secret,
  updateProfile,
};
