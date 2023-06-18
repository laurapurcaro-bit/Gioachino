import { Trans } from "react-i18next";
import styling from "./ProductCardHorizontal.module.css";
import { DeleteOutlined } from "@ant-design/icons";
import { encryptData } from "../../constants";

export default function ProductCartHorizontal({
  p,
  removeFromCart,
  cart,
  setCart,
}) {
  const currency = "EUR";
  const localString = "en-US";
  // hook
  console.log("CART PRODUCT", cart);

  const cartSubTotal = (p) => {
    let subtotal = 0;
    subtotal += p.price * p.quantity;

    return subtotal.toLocaleString(localString, {
      style: "currency",
      currency: currency,
    });
  };

  const updateCart = (increase, decrease) => {
    const existingProductIndex = cart.findIndex((item) => item._id === p._id);
    // If no element is found, it returns -1
    if (existingProductIndex !== -1) {
      console.log("PROD EX");
      console.log("EXISTING PRODUCT", cart);
      // If the product exists, update the quantity
      const updatedCart = [...cart];
      if (increase) {
        updatedCart[existingProductIndex].quantity += 1;
      } else if (decrease) {
        updatedCart[existingProductIndex].quantity -= 1;
      }

      console.log("UPDATED CART", updatedCart);
      encryptData(updatedCart, "cart");
      setCart(updatedCart);
    }
  };

  const handleIncreaseQuantity = () => {
    updateCart(true, false);
    console.log("PRODUCT +", p);
  };

  const handleDecreaseQuantity = () => {
    if (p.quantity > 1) {
      updateCart(false, true);
      console.log("PRODUCT -", p);
    }
  };

  return (
    <div className={`row g-0 ${styling.productCard}`}>
      <div className="col-md-4">
        <img
          className={`img ${styling.productImg}`}
          src={`${
            process.env.REACT_APP_S3_HTTP_BUCKET_DEV
          }/products/${p.categorySlug.toLowerCase()}/${p._id}-0.png`}
          alt={p.name}
        />
      </div>
      <div className="col-md-4">
        <div className={`${styling.bodyText}`}>
          <h3 className="">
            <Trans>{p.name}</Trans>
          </h3>
          <div className="">
            {p.description.length < 50 ? (
              <p>
                <Trans>{p.description}</Trans>
              </p>
            ) : (
              <p>
                <Trans>{p.description.substring(0, 50)}...</Trans>
              </p>
            )}
          </div>
          <p className="">
            <Trans>Color</Trans>: <Trans>{p.color}</Trans>
          </p>
          <p className="">
            <Trans>Size</Trans>: {p.size}
          </p>
          <p
            className={`${styling.removeBtn}`}
            onClick={() => removeFromCart(p)}
          >
            <DeleteOutlined />
          </p>
        </div>
      </div>
      <div className={`col-md-4`}>
        <div className="d-flex h-100">
          {/* Quantity */}
          <div className="row">
            <div className={`col-md-12`}>
              <div className={`${styling.rightContainer} ${styling.quantityContainer}`}>
                <button
                  className={styling.quantityBtn}
                  onClick={handleDecreaseQuantity}
                >
                  -
                </button>
                <p className={styling.quantity}>{p.quantity}</p>
                <button
                  className={styling.quantityBtn}
                  onClick={handleIncreaseQuantity}
                >
                  +
                </button>
              </div>
            </div>
            <div className={`col-md-12 ${styling.rightContainer}`}>
              <h4 className={`${styling.productPrice}`}>{cartSubTotal(p)}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
