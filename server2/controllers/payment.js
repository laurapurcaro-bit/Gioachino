const braintree = require("braintree");
const dotenv = require("dotenv").config();
const { Order } = require("../models/order");
const Product = require("../models/product");

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
          const model = () => {
            if (provider === "google") {
              return "Usergoogle";
            } else {
              return "Useremail";
            }
          };

          const order = new Order({
            products: cart,
            cart: cart,
            paymentInfo: result,
            docModel: model(),
            buyer: req.user._id, // req.user._id
          }).save((err, order) => {
            if (err) {
              console.log(err);
              return res.status(400).send("Error saving order");
            }
            // decrement quantity, increment sold
            decrementQuantity(cart);
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

const decrementQuantity = async (cart) => {
  try {
    const bulkOps = cart.map((item) => {
      console.log("CART", item);
      return {
        updateOne: {
          filter: { _id: item._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(bulkOps, {});
    console.log("PRODUCT QUANTITY-- AND SOLD++", updated);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getTotken, processPayment };
