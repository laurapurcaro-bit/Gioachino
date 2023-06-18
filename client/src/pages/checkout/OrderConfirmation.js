import React, { useState, useEffect } from "react";
import styling from "./OrderConfirmation.module.css";
import { useNavigate, NavLink } from "react-router-dom";
import { Trans } from "react-i18next";
import ConfettiComponent from "./Confetti";
import { decryptData } from "../../constants";

const OrderConfirmationPage = () => {
  const [order, setOrder] = useState({});
  const [confetti, setConfetti] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // const orderLs = JSON.parse(localStorage.getItem("order"));
    const orderLs = decryptData("order");
    setOrder(orderLs);
    setConfetti(true);
  }, []);

  console.log("ORDER", order);

  const paymentMethod = (order) => {
    if (order?.paymentInfo?.transactionMethod === "android_pay_card") {
      return "Google Pay";
    }
  };

  return (
    <>
      {order === null && navigate("/")}
      {order !== null && (
        <div className={`row ${styling.mainContainer}`}>
          <div className="col-md-12">
            <div className={styling.container}>
              <h1 className={styling.heading}>
                <Trans>Thank you!</Trans>
              </h1>
              <div className={styling.confettiContainer}>
                <ConfettiComponent active={confetti} />
              </div>
              <p>Your order has been successfully placed.</p>
            </div>
            <div className={styling.container}>
              <div className={styling.details}>
                <h2>
                  <Trans>Order Details</Trans>
                </h2>
                <p>
                  <Trans>Order ID</Trans>: {order?.orderId}
                </p>
                <p>
                  <Trans>Shipping Address</Trans>:{" "}
                  {order?.shippingAddress?.street}{" "}
                </p>
                <p>
                  <Trans>Shipping Method</Trans>: {order?.shippingMethod}
                </p>
                <p>
                  <Trans>Payment Method</Trans>: {paymentMethod(order)}
                </p>
                <p>
                  <Trans>Order Total</Trans>: {order?.amount} $
                </p>
                <div className={styling.btnContainer}>
                  <NavLink
                    className={styling.orderBtn}
                    to={"/dashboard/user/orders"}
                  >
                    Go to my orders
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderConfirmationPage;
