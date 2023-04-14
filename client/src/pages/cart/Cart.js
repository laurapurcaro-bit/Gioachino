import { useCart } from "../../context/cart";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useState, useEffect } from "react";
import Payment from "../../components/payment/Payment";
import toast from "react-hot-toast";

export default function Cart() {
  // const
  const currency = "EUR";
  const localString = "en-US";
  // context
  const [cart, setCart] = useCart();
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
    // eslint-disable-next-line
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
        info: cart.filter(({ _id }) => d._id === _id),
      };
    });
    console.log("composed", composed);

    setSingleCart(composed);
  };

  const removeFromCart = (productId) => {
    // Remove product from both singleCart and cart
    // Make a copy of the cart
    let mySingleCart = [...singleCart];
    let myCart = [...cart];
    // Find the index of the product to be removed
    let index1 = mySingleCart.findIndex((item) => item._id === productId);
    // Remove the product from the cart
    mySingleCart.splice(index1, 1);
    // Update the state
    setSingleCart(mySingleCart);
    // Find the index of the product to be removed
    const removeItemAll = (arr, value) => {
      let i = 0;
      while (i < arr.length) {
        // If the index of the product is found, remove it
        if (arr[i]._id === value) {
          arr.splice(i, 1);
        } else {
          ++i;
        }
      }
      return arr;
    };
    let myCartUpdate = removeItemAll(myCart, productId);
    // Update the state
    setCart(myCartUpdate);
    // Update the local storage
    localStorage.setItem("cart", JSON.stringify(myCartUpdate));
  };

  const cartSubTotal = (p) => {
    let totalProduct = 0;
    totalProduct += p.info[0].price * p.count;

    return totalProduct.toLocaleString(localString, {
      style: "currency",
      currency: currency,
    });
  };

  const cartTotal = () => {
    let total = 0;
    singleCart.forEach((p) => {
      total += p.info[0].price * p.count;
    });
    return total.toLocaleString(localString, {
      style: "currency",
      currency: currency,
    });
  };

  const onPaymentSuccess = () => {
    // empty the cart
    localStorage.removeItem("cart");
    // empty the state
    setSingleCart([]);
    setCart([]);
    // redirect to dashboard
    navigate("/dashboard/user/orders");
    toast.success("Payment Successful");
  };

  return (
    <>
      <Jumbotron
        title={`Hello ${
          auth?.user?.firstName !== undefined ? auth.user.firstName : ""
        }`}
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
            <div className="col-md-6">
              <div className="row">
                {singleCart?.map((p) => (
                  <div
                    key={p._id}
                    className="card mb-3"
                    style={{ maxWidth: 600 }}
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
                      <div className="col-md-4">
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
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p className="card-text">
                          <small className="text-muted">
                            Listed {moment(p.info[0].createdAt).fromNow()}
                          </small>
                        </p>
                        <p
                          className="text-danger mb-2 pointer"
                          onClick={() => removeFromCart(p._id)}
                        >
                          Remove
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-2 text-center">
              <h4>Subtotal</h4>
              <hr />
              <div>
                {singleCart?.map((p) => {
                  return (
                    <div key={p._id}>
                      <p>
                        {p.info[0].name} x {p.count} = {cartSubTotal(p)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-md-4 text-center">
              <h4>Total</h4>
              <hr />
              <p>Total: {cartTotal()}</p>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3 mt-3">
                    <hr />
                    <h4>Address: </h4>
                    <p>{auth.user.address}</p>
                    <p>
                      {auth.user.CAP} {auth.user.city}
                    </p>
                    <p>{auth.user.country}</p>
                  </div>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update delivery address
                  </button>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update delivery address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning mt-3"
                      // add state and use it in Login to redirect to cart after login
                      onClick={() => navigate("/login", { state: "/cart" })}
                    >
                      Login to checkout
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="col-md-6">
              <Payment
                singleCart={singleCart}
                cartTotal={cartTotal}
                onPaymentSuccess={onPaymentSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
