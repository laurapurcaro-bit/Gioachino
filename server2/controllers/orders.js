const { orderSchema, ObjectId } = require("../models/order");
const mongoose = require("mongoose");

const getOrders = async (req, res) => {
  const { provider } = req.body;
  try {
    if (provider === "google") {
      orderSchema.add({ buyer: { type: ObjectId, ref: "Usergoogle" } });
    } else {
      orderSchema.add({ buyer: { type: ObjectId, ref: "Useremail" } });
    }
    const Order = mongoose.model("Order", orderSchema);
    const orders = await Order.find({ buyer: req.user._id })
      //   .select("-products")
      .populate("products", "-photo")
      .populate("buyer", "firstName")
      .exec();

    res.json(orders);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getOrders };
