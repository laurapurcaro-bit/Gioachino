const braintree = require("braintree");
const dotenv = require("dotenv").config();

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
    const { nonce, amount } = req.body;
    let newTransaction = gateway.transaction.sale(
      {
        amount: "1.00",
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          res.send(result);
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
