import { useCart } from "../../context/cart";
import { useNavigate } from "react-router-dom";
import ProductCardHorizontal from "../../components/cards/ProductCardHorizontal";
import { Trans } from "react-i18next";
import { encryptData } from "../../constants";
import styling from "./Cart.module.css";

export default function Cart() {
  // const
  const currency = "EUR";
  const localString = "en-US";
  // context
  const [cart, setCart] = useCart();
  // hook
  const navigate = useNavigate();

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

  const cartSubTotal = (p) => {
    let totalProduct = 0;
    totalProduct += p.price * p.quantity;

    return totalProduct.toLocaleString(localString, {
      style: "currency",
      currency: currency,
    });
  };

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

  return (
    <>
      <div className={`container-fluid`}>
        <div className="row">
          <div className="col-md-12">
            <div className="p-3 mt-2 mb-2 h4 bg-light">
              <h4>
                <Trans>Cart</Trans>
              </h4>
            </div>
            {cart?.length === 0 && (
              <div className="text-center">
                <h2>
                  <Trans>Your cart is empty.</Trans>
                </h2>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/")}
                >
                  <Trans>Continue Shopping</Trans>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Cart products */}
      {cart?.length > 0 && (
        <div className={`container bg-light ${styling.cartContainer}`}>
          <div className={`row ${styling.cartElements}`}>
            <div className={`col-md-6 ${styling.cartProductItems} ${styling.shadow}`}>
              <div className={`row`}>
                {cart?.map((p) => (
                  <div
                    key={p._id}
                    className={``}
                  >
                    <ProductCardHorizontal
                      p={p}
                      setCart={setCart}
                      removeFromCart={removeFromCart}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Right Section */}
            <div className={`col-md-4 text-center`}>
              <div className={`${styling.cartTotal} ${styling.shadow}`}>
                <h4>
                  <Trans>Total</Trans>
                </h4>
                <hr />
                <div>
                  {cart?.map((p) => {
                    return (
                      <div key={p._id}>
                        <p>
                          {p.name} x {p.quantity} = {cartSubTotal(p)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <p>
                  <Trans>Total</Trans>: {cartTotal()}
                </p>
                <button
                  className={`${styling.checkoutButton}`}
                  onClick={() => navigate("/checkout")}
                >
                  <Trans>Checkout</Trans>
                </button>
              </div>
            </div>
          </div>
          {/* Shipping */}
          <div className={`row`}>
            <div className={`col-md-6 ${styling.cartProduct} ${styling.shadow}`}>
              <h2>
                <Trans>Shipping</Trans>
                <p><Trans>Expected delivery in: 3-5 working days</Trans></p>
              </h2>
            </div>
          </div>
          {/* Payment methods */}
          <div className={`row`}>
            <div className={`col-md-6 ${styling.cartProduct} ${styling.shadow} ${styling.lastContainer}`}>
              <h2>
                <Trans>Payment methods</Trans>
              </h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
