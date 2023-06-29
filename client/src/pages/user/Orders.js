import { useAuth } from "../../context/auth";
import UserMenu from "../../components/nav/UserMenu";
import OrdersCard from "../../components/cards/OrdersCard";
import { useState, useEffect } from "react";
import axios from "axios";
import styling from "./Orders.module.css";
import { Trans } from "react-i18next";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

export default function UserOrders() {
  // context
  const [auth] = useAuth();
  // state
  const [orders, setOrders] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  localStorage.removeItem("order");

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    if (auth?.token) {
      // get user orders
      getOrders();
    }
    // eslint-disable-next-line
  }, [auth?.token]);

  const getOrders = async () => {
    try {
      const { data } = await axios.post("/orders", {
        provider: auth.user.provider,
      });
      console.log("ORDERS", data);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  const options = {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  };

  return (
    <>
      {/* <pre>{JSON.stringify(auth, null, 4)}</pre> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>

          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">
              <Trans>Orders</Trans>
            </div>
            <div className={`row`}>
              {orders?.map((order, index) => {
                return (
                  <>
                    <div className={`col-md-12 ${styling.ordersContainer}`}>
                      {/* Top bar */}
                      <div className={`bg-light ${styling.topBar}`}>
                        <p>
                          <Trans>Order #</Trans>
                          {order.orderId}
                        </p>
                        <div className={styling.colElements}>
                          <p>
                            <Trans>Order total</Trans>:
                          </p>
                          <p>
                            <strong>{order.amount}€</strong>
                          </p>
                          <div className={styling.dropdownContainer}>
                            <div onClick={toggleDropdown}>
                              <p className={styling.manageOrder}>
                                <Trans>Manage order</Trans>
                                {dropdownOpen ? (
                                  <>
                                    {" "}
                                    <UpOutlined />
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    <DownOutlined />
                                  </>
                                )}
                              </p>
                              {dropdownOpen && (
                                <div className={styling.dropdownMenu}>
                                  <ul>
                                    <li><p>Return</p></li>
                                    <li><p>Rate</p></li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`row ${styling.ordersInfo}`}>
                        {/* Product info */}
                        <div className="col-md-3">
                          <h3>
                            <Trans>Items</Trans>
                          </h3>
                          {order?.cart.map((p, i) => (
                            <div key={p._id} className="mb-2">
                              <OrdersCard p={p} />
                            </div>
                          ))}
                        </div>
                        {/* Date */}
                        <div className="col-md-3">
                          <h3>
                            <Trans>Date</Trans>
                          </h3>
                          <p>
                            {order?.createdAt
                              ? new Date(order.createdAt)
                                  .toLocaleDateString("en-GB", options)
                                  .replace(/\//g, "-")
                              : ""}
                          </p>
                          <h3>
                            <Trans>Payment status</Trans>
                          </h3>
                          <p>
                            {order?.paymentInfo.success ? (
                              <p>
                                <Trans>Paid</Trans>
                              </p>
                            ) : (
                              <p>
                                <Trans>Not paid</Trans>
                              </p>
                            )}
                          </p>
                        </div>
                        {/* Shipping info */}
                        <div className="col-md-3">
                          <h3>
                            <Trans>Shipping info</Trans>
                          </h3>
                          <div className="">
                            <p>
                              {order.shippingAddress.name}{" "}
                              {order.shippingAddress.surname}
                            </p>
                            <p>{order.shippingAddress.street}</p>
                            <p>
                              {order.shippingAddress.city},{" "}
                              {order.shippingAddress.zip},{" "}
                              {order.shippingAddress.country}
                            </p>
                          </div>
                        </div>
                        {/* Shipping status */}
                        <div className="col-md-3">
                          <h3>
                            <Trans>Package Status</Trans>
                          </h3>
                          <p>
                            <Trans>{order?.orderStatus}</Trans>
                          </p>
                          <button className={styling.trackButton}>
                            <Trans>Track your package</Trans>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// {orders?.map((order, index) => {
//   return (
//     <div
//       className="border shadow bg-light rounded-4 mb-3"
//       key={order._id}
//     >
//       <table className="table table-bordered">
//         <thead>
//           <tr>
//             <th scope="col">#{order._id}</th>
//             <th scope="col">
//               <Trans>Status</Trans>
//             </th>
//             <th scope="col">
//               <Trans>Ordered</Trans>
//             </th>
//             <th scope="col">
//               <Trans>Payment</Trans>
//             </th>
//             <th scope="col">
//               <Trans>Quantity</Trans>
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>{index + 1}</td>
//             <td>
//               <Trans>{order?.orderStatus}</Trans>
//             </td>
//             <td>{order?.buyer?.firstName}</td>
//             <td>{moment(order?.createdAt).fromNow()}</td>
//             <td>
//               {order?.paymentInfo.success ? (
//                 <p>
//                   <Trans>Success</Trans>
//                 </p>
//               ) : (
//                 <p>
//                   <Trans>Failed</Trans>
//                 </p>
//               )}
//             </td>
//             <td>{order?.products?.length}</td>
//           </tr>
//         </tbody>
//       </table>
//       <div className="container">
//         <div className="row m-3">
//           {order?.cart.map((p, i) => (
//             <div key={p._id} className="mb-2">
//               <OrdersCard p={p} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// })}
