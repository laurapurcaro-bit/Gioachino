const mongoose = require("mongoose");

const userSchemaFacebook = new mongoose.Schema({
  displayName: String,
  firstName: String,
  lastName: String,
  gender: String,
  email: String,
  photo: String,
  password: String,
  facebookId: String,
  provider: String,
  role: { type: Number, default: 0, required: true },
});
const userModelFacebook = mongoose.model("Userfacebook", userSchemaFacebook);
module.exports = { userModelFacebook, userSchemaFacebook };
