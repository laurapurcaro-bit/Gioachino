const mongoose = require("mongoose");

const userSchemaGoogle = new mongoose.Schema({
  displayName: String,
  firstName: String,
  lastName: String,
  gender: String,
  email: String,
  photo: String,
  password: String,
  googleId: String,
  provider: String,
  address: String,
  CAP: String,
  city: String,
  country: String,
  role: { type: Number, default: 0, required: true },
});
const UserModelGoogle = mongoose.model("Usergoogle", userSchemaGoogle);
module.exports = { UserModelGoogle, userSchemaGoogle };
