const mongoose = require("mongoose");
const { Schema } = mongoose;

const WishlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  savedItems: {
    type: Array,
    default: [],
  },
  uniqueId: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema(
  {
    // cut whitespace with trim
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    gender: { type: String },
    email: { type: String, trim: true, required: true, unique: true },
    shippingEmail: { type: String, trim: true },
    photo: { type: String },
    password: { type: String, required: true, minLength: 6, maxLength: 64 },
    phone: { type: String },
    provider: { type: String, default: "email" },
    shippingAddresses: [
      {
        name: { type: String },
        surname: { type: String },
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
        phone: {
          type: String,
        },
        province: {
          type: String,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    billingAddresses: [
      {
        name: { type: String },
        surname: { type: String },
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
        phone: {
          type: String,
        },
        province: {
          type: String,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    role: { type: Number, default: 0, required: true },
    whishlists: {
      type: [WishlistSchema],
      default: [],
    },
  },
  { timestamps: true }
);
// create collection name + schema
module.exports = mongoose.model("Useremail", userSchema);
