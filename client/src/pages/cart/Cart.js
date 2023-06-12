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
  console.log("CART", cart);

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
    return total
  };

  const cartSubTotalCurrency = (subtotal) => {
    return subtotal.toLocaleString(localString, {
      style: "currency",
      currency: currency,
    });
  }

  const shippingCost = (cartSubTotal) => {
    const shippingCost = 5;
    if (cartSubTotal > 50) {
      return 0;
    }
    return shippingCost
  };

  const shippingCostCurrency = (shippingCost) => {
    return shippingCost.toLocaleString(localString, {
      style: "currency",
      currency: currency,
    });
  };

  const cartTotalWithIVA = () => {
    const iva = 0.21;
    const total = cartSubTotal() + shippingCost() + iva;
    encryptData(total, "cartTotalWithIVA");
    return total
  };

  const cartTotalWithIVACurrency = (cartTotalWithIVA) => {
    return cartTotalWithIVA.toLocaleString(localString, {
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
                    onClick={() => navigate("/checkout")}
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
                <p>
                  <Trans>Expected delivery in: 3-5 working days</Trans>
                </p>
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
    </>
  );
}
