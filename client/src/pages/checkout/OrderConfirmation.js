import React, { useState, useEffect } from "react";
import styling from "./OrderConfirmationPage.module.css";
import OrderConfirmationCard from "../../components/cards/OrderConfirmationCard";
import moment from "moment";
import { useNavigate } from "react-router-dom";

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
  }

  return (
    <>
      {order === null && navigate("/")}
      {order !== null && (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <div className={styling.container}>
                <h1 className={styling.heading}>Order Confirmation</h1>
                <div className={styling.details}>
                  <h2>Order Details</h2>
                  <p>Order ID: {order.orderId}</p>
                  <p>Order Date: {order.orderDate}</p>
                  <p>Shipping Address: </p>
                  <p>Shipping Method: </p>
                  <p>Payment Method: {paymentMethod(order)}</p>
                  <p>Order Total: {order.amount} $</p>
                </div>
                <div className={styling.thankYou}>
                  <h2>Thank You!</h2>
                  <p>Your order has been successfully placed.</p>
                </div>
              </div>
            </div>

            <div className="col-md-9">
              <div className="p-3 mt-2 mb-2 h4 bg-light">Orders</div>

              <div
                className="border shadow bg-light rounded-4 mb-3"
                key={order._id}
              >
                <div className="container">
                  <div className="row m-3">
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
        </div>
      )}
    </>
  );
};

export default OrderConfirmationPage;
