import React, { useState } from "react";
import styling from "./CheckoutPageOld.module.css";
import { Trans, useTranslation } from "react-i18next";
import { OrderSumm } from "./OrderSumm";
import PaypalButton from "./PaypalButton";
import { decryptData, encryptData } from "../../constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/cart";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import { DisplayFirstStep, DisplayPaymentStep } from "./DisplaySteps";


const steps = ["Shipping Method", "Payment Method"];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState(null);
  const [instance, setInstance] = useState("");
  const [checked, setChecked] = useState(false);
  // loading state to disable the pay button
  const [loading, setLoading] = useState(false);
  const country = "Italy";
  const [formData, setFormData] = useState({
    shipping: {
      name: "",
      surname: "",
      street: "",
      city: "",
      zip: "",
      phone: "",
      province: "",
      country: country,
      method: "standard",
      timestamp: Date.now(),
    },
    billing: {
      name: "",
      surname: "",
      street: "",
      city: "",
      zip: "",
      province: "",
      country: country,
      timestamp: Date.now(),
    },
    email: "",
    paymentMethod: "card",
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
    } else if (name.startsWith("billing.")) {
      const billingField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        billing: {
          ...prevData.billing,
          [billingField]: fieldValue,
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

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSaveInfo = (e) => {
    const { name, checked } = e.target;
    console.log("checked", checked);
    setChecked(checked);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <DisplayFirstStep
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              handleNextStep={handleNextStep}
              handleSaveInfo={handleSaveInfo}
              checked={checked}
              message={message}
              setMessage={setMessage}
            />
          </>
        );
      case 2:
        return (
          <>
            <DisplayPaymentStep
              formData={formData}
              setFormData={setFormData}
              handlePreviousStep={handlePreviousStep}
              instance={instance}
              setInstance={setInstance}
              message={message}
              loading={loading}
              handleBuy={handleBuy}
            />
          </>
        );
      default:
        return null;
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
          {/* Steps */}
          <div>{renderStep()}</div>
        </div>
        {/* Render the steps components */}
        <div className="col-md-5">
          <div className={`${styling.scrollableColumn}`}>
            <OrderSumm />
          </div>
        </div>
        <div className="row">
          <div className="col-md-7"></div>
        </div>
      </div>
    </div>
  );
}
