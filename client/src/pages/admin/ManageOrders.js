import { useAuth } from "../../context/auth";
import AdminMenu from "../../components/nav/AdminMenu";
import OrdersCard from "../../components/cards/OrdersCard";
import AdminSearchBar from "../../components/forms/AdminSearchBar";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Select } from "antd";

export default function ManageOrdersAdmin() {
  // context
  const [auth] = useAuth();
  // state
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState(["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled", "Completed"]);
  const [changedStatus, setChangedStatus] = useState("");

  useEffect(() => {
    if (auth?.token) {
      // get user orders
      getOrders();
    }
    // eslint-disable-next-line
  }, [auth?.token]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/admin/orders");
      console.log("ORDERS", data);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOrderStatusChange = async (orderId, value) => {
    setChangedStatus(value);
    try {
      const { data } = await axios.put(`/admin/order-update-status/${orderId}`, {
        orderStatus: value,
      });
      console.log("ORDER STATUS UPDATE", data);
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* <pre>{JSON.stringify(auth, null, 4)}</pre> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>

          <div className="col-md-9">
            <AdminSearchBar />
            <div className="p-3 mt-2 mb-2 h4 bg-light">Orders</div>

            {orders?.map((order, index) => {
              return (
                <div className="border shadow bg-light rounded-4 mb-3" key={order._id}>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">#{order._id}</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Ordered</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{index + 1}</td>
                        <td>
                          <Select
                            onChange={(value) => handleOrderStatusChange(order._id, value)}
                            bordered={true}
                            defaultValue={order.orderStatus}
                            style={{ width: 150 }}
                          >
                            {status.map((status, index) => (
                              <Select.Option key={index} value={status}>
                                {status}
                              </Select.Option>
                            ))}
                          </Select>
                        </td>
                        <td>{order?.buyer?.firstName}</td>
                        <td>{moment(order?.createdAt).fromNow()}</td>
                        <td>{order?.paymentInfo.success ? "Success" : "Failed"}</td>
                        <td>{order?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    <div className="row m-3">
                      {order?.cart.map((p, i) => (
                        <div key={p._id} className="mb-2">
                          <OrdersCard p={p} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
