const { Order } = require("../models/order");

const getOrders = async (req, res) => {
  const { provider } = req.body;
  try {
    // if (provider === "google") {
    //   orderSchema.add({ buyer: { type: ObjectId, ref: "Usergoogle" } });
    // } else {
    //   orderSchema.add({ buyer: { type: ObjectId, ref: "Useremail" } });
    // }
    // const Order = mongoose.model("Order", orderSchema);
    const orders = await Order.find({ buyer: req.user._id })
      //   .select("-products")
      .populate("products", "-photo")
      .populate("buyer", "firstName")
      .exec();
    console.log("ORDERS", orders);
    res.json(orders);
  } catch (error) {
    console.log(error);
  }
};

const getAllOrders = async (req, res) => {
  try {
    // const Order = mongoose.model("Order", orderSchema);
    const allOrders = await Order.find({})
      .populate("products", "-photo")
      .populate("buyer", "firstName")
      .exec();
    console.log("ALL ORDERS", allOrders);
    res.json(allOrders);
  } catch (error) {
    console.log(error);
  }
};

const ordersSearch = async (req, res) => {
  try {
    const { search } = req.params;
    // find the product based on the search query
    const results = await Order.findById({ _id: search });
    // return the products
    res.json(results);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getOrders, getAllOrders, ordersSearch };
