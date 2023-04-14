const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    products: [{ type: ObjectId, ref: "Product" }],
    paymentInfo: {},
    cart: { type: Array, default: [] },
    // refers to MongoDB User model
    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Completed",
      ],
    },
  },
  { timestamps: true }
);

module.exports = { orderSchema, ObjectId };
