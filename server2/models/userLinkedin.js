const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchemaLinkedin = new mongoose.Schema({
  displayName: String,
  firstName: String,
  lastName: String,
  gender: String,
  email: String,
  photo: String,
  password: String,
  linkedinId: String,
  provider: String,
  addresses: [
    {
      street: {
        type: String,
        
      },
      CAP: {
        type: String,
        
      },
      city: {
        type: String,
        
      },
      country: {
        type: String,
        
      },
    },
  ],
  whishlists: [],
  role: { type: Number, default: 0, required: true },
});
const UserModelLinkedin = mongoose.model("Userlinkedin", userSchemaLinkedin);
module.exports = { UserModelLinkedin, userSchemaLinkedin };
