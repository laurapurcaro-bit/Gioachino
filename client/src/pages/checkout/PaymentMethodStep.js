import React from "react";
import Payment from "../../components/payment/Payment";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";

const PaymentMethodStep = ({
  paymentMethod,
  onPrevious,
  onPaymentMethodChange,
}) => {
  // const
  const currency = "EUR";
  const localString = "en-US";
  // hook
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
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
    <div>
      <h2>Step 3: Select payment method</h2>
      <div>
        <Payment
          cart={cart}
          cartTotal={cartTotal}
          onPaymentSuccess={onPaymentSuccess}
        />
      </div>
      <button onClick={onPrevious}>Previous</button>
    </div>
  );
};

export default PaymentMethodStep;
