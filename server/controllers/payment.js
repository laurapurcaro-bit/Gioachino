const braintree = require("braintree");
const dotenv = require("dotenv").config();
const { Order } = require("../models/order");
const Product = require("../models/product");
const sgMail = require("@sendgrid/mail");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY_DEV, {
  apiVersion: "2022-08-01",
});

// config sendgrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

function generateOrderId() {
  const timestamp = Date.now().toString();
  const randomNumber = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return timestamp + randomNumber;
}

const processPayment = async (req, res) => {
  try {
    // hardcode $10
    // console.log("PAYMENT", req.body);
    const { nonce, cart, amount, provider, selectedAddress, shippingMethod } =
      req.body;

    let newTransaction = gateway.transaction.sale(
      {
        amount: amount,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          console.log("RESULT", result);
          // res.send(result);
          // create order
          const model = () => {
            if (provider === "google") {
              return "Usergoogle";
            } else {
              return "Useremail";
            }
          };

          const orderId = generateOrderId();

          const order = new Order({
            products: cart,
            cart: cart,
            orderId: orderId,
            amount: amount,
            shippingAddress: selectedAddress,
            shippingMethod: shippingMethod,
            paymentInfo: {
              transactionId: result.transaction.id,
              transactionMethod: result.transaction.paymentInstrumentType,
              orderDate: result.transaction.createdAt,
              success: result.success,
            },
            buyer: req.user._id,
            phone: selectedAddress.phone || "",
            docModel: model(),
            orderDate: result.transaction.createdAt,
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
      // console.log("CART", item);
      return {
        updateOne: {
          filter: { _id: item._id },
          update: { $inc: { stock: -item.quantity } },
        },
      };
    });
    const updated = await Product.bulkWrite(bulkOps, {});
    // console.log("PRODUCT STOCK-- AND SOLD++", updated);
  } catch (error) {
    console.log(error);
  }
};

const sendEmailAfterPayment = async (req, res) => {
  // send email alert to admin
  const { order } = req.body;

  const findOrder = await Order.findById(order._id).populate(
    "buyer",
    "firstName email"
  );
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: findOrder.buyer.email,
    subject: `Your order ${findOrder._id} is recevied`,
    html: `
        <h1>Thank you ${findOrder.buyer.firstName} for shopping with us</h1>
        <p>Your order is <span style="color:red;">recevied</span> and will be processed soon</p>
        <p>Order ID: ${findOrder._id}</p>
        <p>Order Status: ${findOrder.orderStatus}</p>
        <p>Order Total: ${findOrder.amount}</p>
        <p>Order Date: ${findOrder.createdAt}</p>
        <p>Delivery Address: ${findOrder.address}</p>
        <hr />
        <p>Do not reply to this email</p>
        <p>Visit our website for more information: <a href="${process.env.CLIENT_URL}/dashboard/user/orders">your dashboard</a></p>
      `,
  };
  // send email
  try {
    await sgMail.send(emailData);
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Email could not be sent" });
  }
};

const configStripe = async (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY_DEV,
  });
};

const createPaymentIntent = async (req, res) => {
  try {
    console.log("BODY", req.body);
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "eur",
      // 10 EUR = 1000 (ovvero 1000 centesimi)
      amount: 1999,
      automatic_payment_methods: { enabled: true },
      shipping: {
        name: 'Jenny Rosen',
        address: {
          line1: '1234 Main Street',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
          postal_code: '94111',
        },
      },
      // payment_method_types: ["card", "sepa_debit", "google_pay", "apple_pay"],
      // Verify your integration in this guide by including this parameter
      // metadata: { integration_check: "accept_a_payment" },
    });

    // Send publishable key and PaymentIntent details to client
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
      paymentIntent: paymentIntent,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
};

const webhook = async (req, res) => {
  // Expose a endpoint as a webhook handler for asynchronous events.
  // Configure your webhook in the stripe developer dashboard
  // https://dashboard.stripe.com/test/webhooks

  let data, eventType;

  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // we can retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "payment_intent.succeeded") {
    // Funds have been captured
    // Fulfill any orders, e-mail receipts, etc
    // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
    console.log("💰 Payment captured!");
  } else if (eventType === "payment_intent.payment_failed") {
    console.log("❌ Payment failed.");
  }
  res.sendStatus(200);
};

module.exports = {
  getTotken,
  processPayment,
  sendEmailAfterPayment,
  configStripe,
  createPaymentIntent,
  webhook,
};
