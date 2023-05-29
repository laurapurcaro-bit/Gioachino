import { useSearch } from "../../context/search";
import AdminMenu from "../../components/nav/AdminMenu";
import AdminSearchBar from "../../components/forms/AdminSearchBar";
import OrdersCard from "../../components/cards/OrdersCard";
import moment from "moment";

export default function AdminResultsSearchBar() {
  const [values] = useSearch();

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

            {values?.results?.length < 1 &&
              values?.results?.map((order, index) => {
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
                          <td>{order?.orderStatus}</td>
                          {/* <td>{order?.buyer?.firstName}</td> */}
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
