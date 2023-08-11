import { useCart } from "../../context/cart";
import { useNavigate } from "react-router-dom";
import ProductCardHorizontal from "../../components/cards/ProductCardHorizontal";
import { Trans } from "react-i18next";
import { encryptData } from "../../constants";
import styling from "./Cart.module.css";
import BusinessDaysConverter from "./BusinessDaysConverter";
import { useAuth } from "../../context/auth";
import emptyCart from "../../images/empty-cart.svg";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Cart() {
  // const
  const currency = "EUR";
  const localString = "en-US";
  // context
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const [isOrders, setIsOrders] = useState(false);
  // hook
  const navigate = useNavigate();
  console.log("CART", cart);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      console.log("AUTH", auth?.user?.provider);
      const { data } = await axios.post("/orders", {
        provider: auth?.user?.provider,
      });
      console.log("ORDERS", data);
      if (data?.error) {
        setIsOrders(false);
      } else {
        setIsOrders(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCart = (product) => {
    // Make a copy of the cart
    let myCart = [...cart];
    // Filter out the product with the matching _id
    myCart = myCart.filter((item) => item._id !== product._id);
    // Update the state
    setCart(myCart);
    // Update the local storage
    encryptData(myCart, "cart");
  };

  const cartSubTotal = () => {
    let total = 0;
    cart.forEach((p) => {
      total += p.price * p.quantity;
    });
    return total;
  };

  const cartSubTotalCurrency = (subtotal) => {
    return subtotal.toLocaleString(localString, {
      style: "currency",
      currency: currency,
    });
  };

  const shippingCost = (cartSubTotal) => {
    const shippingCost = 5;
    console.log("CART SUBTOTAL", cartSubTotal);
    if (cartSubTotal > 50) {
      return 0;
    }
    return shippingCost;
  };

  const shippingCostCurrency = (shippingCost) => {
    return shippingCost.toLocaleString(localString, {
      style: "currency",
      currency: currency,
    });
  };

  const cartTotalWithIVA = () => {
    const subtotal = cartSubTotal();
    const shippingCosts = shippingCost(subtotal);
    const total = subtotal + shippingCosts;
    encryptData(total, "cartTotalWithIVA");
    return total;
  };

  const cartTotalWithIVACurrency = (cartTotalWithIVA) => {
    return cartTotalWithIVA.toLocaleString(localString, {
      style: "currency",
      currency: currency,
    });
  };

  const handleCheckout = () => {
    // if (isOrders) {
    //   navigate("/logged/fast-checkout");
    //   return;
    // } else {
    //   navigate("/logged/checkout");
    // }
    navigate("/logged/checkout");
  };

  return (
    <div className={styling.wrap}>
      <div className={`container-fluid`}>
        <div className="row">
          <div className="col-md-12">
            {/* Empty cart */}
            {cart?.length === 0 && (
              <div>
                <div className={styling.emptyCart}>
                  <h2>
                    <Trans>Oops, your cart is empty.</Trans>
                  </h2>
                  <img
                    src={emptyCart}
                    alt="Empty cart"
                    className={styling.emptyCartImage}
                  />
                  <button
                    className={styling.emptyCartButton}
                    onClick={() => navigate("/catalogue")}
                  >
                    <Trans>Continue Shopping</Trans>
                  </button>
                </div>
                <div className={styling.relatedProducts}>
                  <h5>
                    <Trans>You could also like..</Trans>
                  </h5>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Cart products */}
      {cart?.length > 0 && (
        <div className={`container bg-light ${styling.cartContainer}`}>
          <div className={`row ${styling.cartElements}`}>
            <div
              className={`col-md-6 ${styling.cartProductItems} ${styling.shadow}`}
            >
              <h2 className={`${styling.cartTitle}`}>
                <Trans>Cart</Trans> ({cart?.length}{" "}
                {cart?.length > 1 ? (
                  <Trans>products</Trans>
                ) : (
                  <Trans>product</Trans>
                )}
                )
              </h2>
              <div className={`row`}>
                {cart?.map((p) => (
                  <div key={p._id} className={``}>
                    <ProductCardHorizontal
                      p={p}
                      cart={cart}
                      setCart={setCart}
                      removeFromCart={removeFromCart}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Right Section */}
            <div className={`col-md-4`}>
              <div className={`${styling.cartTotal} ${styling.shadow}`}>
                <div className={`${styling.totalContent}`}>
                  <h2>
                    <Trans>Total</Trans>
                  </h2>
                  <hr />
                  <table className="table">
                    <thead className="">
                      <tr>
                        <th>
                          <p className={`${styling.subtotal}`}>
                            <Trans>Subtotal</Trans>
                          </p>
                        </th>
                        <th>
                          <p className={`${styling.subtotalContent}`}>
                            {cartSubTotalCurrency(cartSubTotal())}
                          </p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <p className={`${styling.subtotal}`}>
                            <Trans>Shipping</Trans>
                          </p>
                        </td>
                        <td>
                          <p className={`${styling.subtotalContent}`}>
                            {shippingCostCurrency(shippingCost())}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className={`${styling.subtotal}`}>
                            <Trans>Total (IVA inlcuded)</Trans>
                          </p>
                        </td>
                        <td>
                          <p className={`${styling.subtotalContent}`}>
                            {cartTotalWithIVACurrency(cartTotalWithIVA())}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={`${styling.checkoutSection}`}>
                  <button
                    className={`${styling.checkoutButton}`}
                    onClick={() => handleCheckout()}
                  >
                    <Trans>Checkout</Trans>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Shipping */}
          <div className={`row`}>
            <div
              className={`col-md-6 ${styling.cartProduct} ${styling.shadow}`}
            >
              <h2>
                <Trans>Shipping</Trans>
                <BusinessDaysConverter />
              </h2>
            </div>
          </div>
          {/* Payment methods */}
          <div className={`row`}>
            <div
              className={`col-md-6 ${styling.cartProduct} ${styling.shadow} ${styling.lastContainer}`}
            >
              <h2>
                <Trans>Payment methods</Trans>
              </h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
