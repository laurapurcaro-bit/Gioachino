const { Order } = require("../models/order");
const sgMail = require("@sendgrid/mail");

// config sendgrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
      .sort({ createdAt: -1 }) // sort by latest order in descending order
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

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    const findOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    )
      .populate("buyer", "email firstName") // populate buyer with email and firstName
      .exec();
    console.log("FIND ORDER", findOrder);
    // send email
    // prepare email content
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: findOrder.buyer.email,
      subject: `Good news! Your order ${findOrder._id} is ${findOrder.orderStatus}`,
      html: `
        <h1>Thank you ${findOrder.buyer.firstName} for shopping with us</h1>
        <p>Do not reply to this email</p>
        <p>Visit our website for more information: <a href="${process.env.CLIENT_URL}/dashboard/user/orders">your dashboard</a></p>
      `,
    };
    // send email
    try {
      await sgMail.send(emailData);
    } catch (error) {
      console.log(error);
    }
    // return updated order
    res.json(findOrder);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getOrders, getAllOrders, ordersSearch, updateOrderStatus };
