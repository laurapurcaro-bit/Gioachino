import React, { useState, useEffect } from "react";
import styling from "./OrderConfirmationPage.module.css";
import OrderConfirmationCard from "../../components/cards/OrderConfirmationCard";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";

const OrderConfirmationPage = () => {
  const [order, setOrder] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const orderLs = JSON.parse(localStorage.getItem("order"));
    setOrder(orderLs);
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
        <div className="container-fluid">
          <div className="p-3 mt-2 mb-2 h4 bg-light"><Trans>Order confirmation</Trans></div>
          <div className="row">
            <div className="col-md-6">
              <div className={styling.container}>
                <h1 className={styling.heading}><Trans>Thank you for your order!</Trans></h1>
                <div className={styling.details}>
                  <h2>Order Details</h2>
                  <p>Order ID: {order.orderId}</p>
                  <p>Order Date: {order.orderDate}</p>
                  <p>Shipping Address: {order.shippingAddress.street} </p>
                  <p>Shipping Method: {order.shippingMethod}</p>
                  <p>Payment Method: {paymentMethod(order)}</p>
                  <p>Order Total: {order.amount} $</p>
                </div>
                <div className={styling.thankYou}>
                  
                  <p>Your order has been successfully placed.</p>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div
                className="border shadow bg-light rounded-4 mb-3"
                key={order._id}
              >
              <h2><Trans>Products</Trans></h2>
                <div className="container">
                  {order?.cart?.map((p, i) => (
                    <div key={p._id} className="mb-2">
                      <OrderConfirmationCard p={p} />
                    </div>
                  ))}
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
