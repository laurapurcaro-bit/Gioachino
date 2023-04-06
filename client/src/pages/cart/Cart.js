import { useCart } from "../../context/cart";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useState, useEffect } from "react";

export default function Cart() {
  // context
  const [cart] = useCart();
  const [auth] = useAuth();
  // hook
  const [singleCart, setSingleCart] = useState([]);
  const navigate = useNavigate();

  const subtitleText = () => {
    if (cart?.length > 1) {
      if (auth.token) {
        return `You have ${cart?.length} items in the cart.`;
      } else {
        return `Please login to checkout`;
      }
    } else if (cart?.length === 1) {
      if (auth.token) {
        return `You have ${cart?.length} item in the cart.`;
      } else {
        return `Please login to checkout`;
      }
    } else {
      return "Cart is empty";
    }
  };

  useEffect(() => {
    countQuantitySingleProduct();
  }, [cart]);

  const countQuantitySingleProduct = () => {
    const countsById = {};

    cart.forEach(function ({ _id }) {
      countsById[_id] = (countsById[_id] || 0) + 1;
    });
    const finalArray = Object.entries(countsById)
      .map(([_id, count]) => ({ _id, count }))
      .sort((a, b) => b.count - a.count);

    const composed = finalArray.map((d) => {
      return {
        ...d,
        info: cart.filter(({ _id }) => {
          if (d._id === _id) return _id;
        }),
      };
    });
    setSingleCart(composed);
  };

  const currency = "EUR";
  const localString = "en-US";

  return (
    <>
      <Jumbotron
        title={`Hello ${auth?.token && auth.user?.firstName}`}
        subTitle={subtitleText()}
      />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="p-3 mt-2 mb-2 h4 bg-light">
              {cart?.length > 0 ? (
                "My cart"
              ) : (
                <div className="text-center">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/")}
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <pre>{JSON.stringify(singleCart, null, 4)}</pre>
      <pre>{JSON.stringify(cart, null, 4)}</pre> */}
      {/* Product info in cart */}
      {/* display product with margin: mx-4 */}
      {cart?.length > 0 && (
        <div className="container mx-4">
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                {singleCart?.map((p) => (
                  <div
                    key={p._id}
                    className="card mb-3"
                    style={{ maxWidth: 540 }}
                  >
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src={`${process.env.REACT_APP_API}/product/photo/${p._id}`}
                          alt={p.info[0].name}
                          style={{
                            height: "100%",
                            width: "100%",
                            // fix this!!!!!!!
                            // objectFit: "cover",

                            marginLeft: "-10%",
                            borderBottomRightRadius: "0px",
                          }}
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title"> {p.info[0].name} </h5>
                          <p className="card-text">
                            {p.info[0].description.length < 50
                              ? `${p.info[0].description}`
                              : `${p.info[0].description.substring(0, 50)}...`}
                          </p>
                          <p className="card-text">
                            {p?.info[0].price?.toLocaleString(localString, {
                              style: "currency",
                              currency: currency,
                            })}
                          </p>
                          <p className="card-text">Quantity: {p.count}</p>
                          <p className="card-text">{}</p>
                          <p className="card-text">
                            <small className="text-muted">
                              Listed {moment(p.info[0].createdAt).fromNow()}
                            </small>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-4 text-center">Total</div>
          </div>
        </div>
      )}
    </>
  );
}
