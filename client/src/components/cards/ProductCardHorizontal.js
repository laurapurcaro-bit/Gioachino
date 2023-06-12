import { Trans } from "react-i18next";
import styling from "./ProductCardHorizontal.module.css";
import { DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function ProductCartHorizontal({ p, removeFromCart, setCart }) {
  const currency = "EUR";
  const localString = "en-US";
  // hook
  const [quantity, setQuantity] = useState(0);
  const [product, setProduct] = useState({});

  const cartSubTotal = (p) => {
    let totalProduct = 0;
    totalProduct += p.price * p.quantity;

    return totalProduct.toLocaleString(localString, {
      style: "currency",
      currency: currency,
    });
  };

  const handleIncreaseQuantity = () => {
    p.quantity = p.quantity + 1;
    setQuantity(p.quantity + 1);
    // USE CART CONTEXT
    setProduct((prev) => ({ ...prev, p }));
    console.log("PRODUCT +", p);
  };

  const handleDecreaseQuantity = () => {
    if (p.quantity > 1) {
      setQuantity(p.quantity - 1);
      p.quantity = p.quantity - 1;
      setProduct((prev) => ({ ...prev, p }));
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
        <div className="">
          <h5 className="">
            <Trans>{p.name}</Trans>
          </h5>
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
            <Trans>Color</Trans>: {p.color}
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
      <div className={`col-md-4 ${styling.rightColumn}`}>
        <div className="d-flex align-items-center justify-content-end h-100">
          {/* Quantity */}
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
          <h4 className={`${styling.productPrice}`}>
            {p?.price?.toLocaleString(localString, {
              style: "currency",
              currency: currency,
            })}
          </h4>
        </div>
      </div>
    </div>
  );
}
