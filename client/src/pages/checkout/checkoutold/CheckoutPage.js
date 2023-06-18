import React, { useState, useEffect } from "react";
import styling from "./CheckoutPage.module.css";
import ShippingForm from "../ShippingForm";
// import PaymentForm from "./PaymentMethod";
import { Trans, useTranslation } from "react-i18next";
import PaymentCustom from "../../../components/payment/PaymentCustom";
import { OrderSumm } from "../OrderSumm";
import PaypalButton from "../PaypalButton";
import { decryptData, encryptData } from "../../../constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../../context/cart";
import { useAuth } from "../../../context/auth";
import toast from "react-hot-toast";
import ContactInformation from "../ContactInformation";
import BillingForm from "../BillingForm";
import { DisplaySteps } from "../DisplaySteps";

const steps = ["Address", "Shipping Method", "Payment Method"];

export default function CheckoutPage() {
  const [message, setMessage] = useState(null);
  const [instance, setInstance] = useState("");
  // loading state to disable the pay button
  const [loading, setLoading] = useState(false);
  const country = "Italy";
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    shipping: {
      street: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      province: "",
      country: country,
      method: "",
    },
    billing: {
      street: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      province: "",
      country: country,
      method: "",
    },
    email: "",
    paymentMethod: "",
    billingAddressSameAsShippingAddress: true,
  });

  // const
  const currency = "EUR";
  const localString = "en-US";
  // hook
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [auth] = useAuth();

  const cartLs = decryptData("cart");
  // function
  const cartTotal = () => {
    const total = decryptData("cartTotalWithIVA");
    // console.log("TOTAL", total);
    return total;
  };

  const amount = cartTotal();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setMessage(null);
    console.log("name", name);
    if (name.startsWith("shipping.")) {
      const shippingField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        shipping: {
          ...prevData.shipping,
          [shippingField]: fieldValue,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: fieldValue,
      }));
    }

    console.log("formData", formData);
  };

  const onPaymentSuccess = async (data) => {
    // empty the cart
    localStorage.removeItem("cart");
    // empty the state
    setCart([]);
    // send email to user
    await axios.post(`/payment-success/send-email`, {
      order: data,
    });
    // localStorage.setItem("order", JSON.stringify(data));
    encryptData(data, "order");
    // redirect to dashboard
    navigate("/order-confirmation");
    toast.success("Payment Successful");
  };

  const handleBuy = async () => {
    try {
      setLoading(true);
      // access the nonce
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/braintree/payment", {
        nonce,
        cart: cartLs,
        selectedAddress: formData.shipping,
        shippingMethod: formData.shipping.method,
        amount: amount,
        provider: auth.user.provider,
      });
      setLoading(false);
      // empty the cart and send email and redirect to dashboard
      onPaymentSuccess(data);
    } catch (error) {
      console.log(error);
      setMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className={styling.container}>
      <div className="">
        <h1 style={{ fontSize: "5rem" }}>Checkout</h1>
      </div>
      <hr />
      <div className="row">
        <div className={`col-md-7`}>
          {/* Button */}
          <div className={styling.containerExpressCheckout}>
            <div className={styling.expressCheckoutDiv}>
              <div className={styling.expressCheckoutHeader}>
                Express checkout
              </div>
              <div className={styling.paypalButtonContainer}>
                {/* <PaypalButton /> */}
              </div>
            </div>
          </div>
          {/* Steps */}
          <div className={styling.lineContainer}>
            <div className={styling.line}></div>
            <div className={styling.textLine}>or continue with</div>
          </div>
          <DisplaySteps
            stepN="1."
            stepTitle="Contact information"
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            Component={ContactInformation}
          />
          <DisplaySteps
            stepN="2."
            stepTitle="Shipping address"
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            Component={ShippingForm}
          />
          {formData.billingAddressSameAsShippingAddress ? null : (
            <DisplaySteps
              stepN="3."
              stepTitle="Billing address"
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              Component={BillingForm}
            />
          )}
          <DisplaySteps
            stepN={formData.billingAddressSameAsShippingAddress ? "3." : "4."}
            stepTitle="Payment method"
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            Component={PaymentCustom}
          />
        </div>
        <div className="col-md-5">
          <div className={`${styling.scrollableColumn}`}>
            <OrderSumm />
          </div>
        </div>
        <div>
          <p>
            To proceed with your purchase, accept the Terms & Conditions and
            Privacy Policy
          </p>
          <hr />
          <div className={styling.colElements}>
            <span>Back to cart</span>
            <button
              className={styling.payButton}
              onClick={handleBuy}
              // hidden
              disabled={!instance || loading}
            >
              {loading ? (
                <p>
                  <Trans>Loading</Trans>...
                </p>
              ) : (
                <p>
                  <Trans>Pay</Trans>
                </p>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
