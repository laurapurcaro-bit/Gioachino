const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: {},
      required: true,
      maxlength: 2000,
    },
    shortDesc: {
      type: String,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    currency: {
      type: String,
      default: "EUR",
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    categorySlug: {
      type: String,
      required: true,
    },
    // for the cart
    quantity: {
      type: Number,
      default: 1,
    },
    stock: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      name: String,
      photosInfo: {},
    },
    additionalPhotos: {
      name: [String],
      default: [],
    },
    color: {
      type: String,
    },
    size: {
      type: String,
    },
    shipping: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
