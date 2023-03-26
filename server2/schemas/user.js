const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  displayName: String,
  firstName: String,
  lastName: String,
  gender: String,
  email: String,
  photo: String,
  password: String,
  googleId: String,
  facebookId: String,
  linkedinId: String,
  provider: String,
});

module.exports = userSchema;
