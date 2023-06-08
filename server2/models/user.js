const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    // cut whitespace with trim
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    gender: { type: String },
    email: { type: String, trim: true, required: true, unique: true },
    photo: { type: String },
    password: { type: String, required: true, minLength: 6, maxLength: 64 },
    provider: { type: String, default: "email" },
    addresses: [
      {
        street: {
          type: String,
          
        },
        zip: {
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
    role: { type: Number, default: 0, required: true },
    savedItems: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);
// create collection name + schema
module.exports = mongoose.model("Useremail", userSchema);
