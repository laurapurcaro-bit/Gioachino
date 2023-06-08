const mongoose = require("mongoose");
const { Schema } = mongoose;

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
  savedItems: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  role: { type: Number, default: 0, required: true },
});
const UserModelGoogle = mongoose.model("Usergoogle", userSchemaGoogle);
module.exports = { UserModelGoogle, userSchemaGoogle };
