const braintree = require("braintree");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const { orderSchema, ObjectId } = require("../models/order");

// Braintree payment gateway
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const getTotken = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        // send token to client
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
const processPayment = async (req, res) => {
  try {
    // hardcode $10
    console.log("PAYMENT", req.body);
    const { nonce, cart, amount, provider } = req.body;
    const correctAmount = amount.split("€")[1];
    console.log("CORRECT AMOUNT", correctAmount);
    let newTransaction = gateway.transaction.sale(
      {
        amount: correctAmount,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          // res.send(result);
          // create order
          orderSchema.add({ buyer: { type: ObjectId, ref: provider } });
          const Order = mongoose.model("Order", orderSchema);
          const order = new Order({
            products: cart,
            cart: cart,
            paymentInfo: result,
            buyer: req.user,
          }).save((err, order) => {
            if (err) {
              console.log(err);
              return res.status(400).send("Error saving order");
            }
            res.send(order);
          });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getTotken, processPayment };
