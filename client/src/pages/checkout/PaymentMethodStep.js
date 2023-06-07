import React from "react";
import Payment from "../../components/payment/Payment";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";
import styling from "./PaymentMethodStep.module.css";
import OrderSummary from "./OrderSummary";
import { Trans } from "react-i18next";

const PaymentMethodStep = ({
  paymentMethod,
  onPrevious,
  onPaymentMethodChange,
  address,
  shippingMethod,
}) => {
  // const
  const currency = "EUR";
  const localString = "en-US";
  // hook
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const cartLs = JSON.parse(localStorage.getItem("cart"));
  // function
  const cartTotal = () => {
    let total = 0;
    cart.forEach((p) => {
      total += p.price * p.quantity;
    });
    return total.toLocaleString(localString, {
      style: "currency",
      currency: currency,
    });
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
    localStorage.setItem("order", JSON.stringify(data));
    // redirect to dashboard
    navigate("/order-confirmation");
    toast.success("Payment Successful");
  };

  return (
    <div className={styling.container}>
      <div className="card mb-3">
        <div className="row g-0">
          <div className="col-md-7">
            <h2>
              <Trans>Order summary</Trans>
            </h2>
            <OrderSummary
              cart={cart}
              address={address}
              shipping={shippingMethod}
            />
          </div>
          <div className="col-md-4">
            <h2>
              <Trans>Step 3: Select payment method</Trans>
            </h2>
            <div>
              <Payment
                cart={cartLs}
                cartTotal={cartTotal}
                onPaymentSuccess={onPaymentSuccess}
              />
            </div>
          </div>
        </div>
      </div>
      <button onClick={onPrevious} className={styling.previousButton}>
        <Trans>Previous</Trans>
      </button>
    </div>
  );
};

export default PaymentMethodStep;
