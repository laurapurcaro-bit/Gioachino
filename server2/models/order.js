const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    products: [{ type: ObjectId, ref: "Product" }],
    paymentInfo: {},
    cart: { type: Array, default: [] },
    buyer: { type: ObjectId, refPath: "docModel" },
    docModel: {
      type: String,
      enum: ["Useremail", "Usergoogle", "Userfacebook"],
      required: true,
    },
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

const Order = mongoose.model("Order", orderSchema);
module.exports = { Order, ObjectId };
