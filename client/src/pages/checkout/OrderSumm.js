import React, { useState } from "react";
import styling from "./OrderSumm.module.css";
import { ChevronDown, ChevronUp } from "../../images/icons/TablerIcons";
import { useCart } from "../../context/cart";
import { Badge, Space } from "antd";

function OrderSumm() {
  const [showDiscount, setShowDiscount] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  const handleShowDiscount = () => {
    setShowDiscount(true);
  };

  const handleShowProducts = () => {
    setShowProducts(!showProducts);
  };

  return (
    <div className={styling.orderSummaryDiv}>
      <div>
        <h2>Riepilogo dell'ordine</h2>
      </div>
      <div className={styling.colElements} onClick={handleShowProducts}>
        <span>Products</span>
        <span>{showProducts ? <ChevronUp /> : <ChevronDown />}</span>
      </div>
      {showProducts && (
        <>
          <OrderSummaryProducts />
        </>
      )}
      <hr />
      <div className={styling.colElements}>
        <span>Subtotale</span>
        <span>
          <strong>$70.00</strong>
        </span>
      </div>
      <hr />
      <div>
        {!showDiscount && (
          <span className={styling.discounts} onClick={handleShowDiscount}>
            Inserisci codice
          </span>
        )}
        {showDiscount && (
          <>
            <div className={styling.colElements}>
              <input
                type="text"
                placeholder="apply discount"
                style={{ width: "70%" }}
              />
              <button>Applica</button>
            </div>
          </>
        )}
      </div>
      <hr />
      {/* <div>
        <span className={styling.giftCard}>Hai una gift card?</span>
      </div>
      <hr /> */}
      <div className={styling.colElements}>
        <span className={styling.total}>
          <strong>Totale</strong>
        </span>
        <span className={styling.total}>
          <strong>$70.00</strong>
        </span>
      </div>
    </div>
  );
}

function OrderSummaryProducts() {
  // context
  const [cart, setCart] = useCart();
  console.log("CART", cart);
  return (
    <>
      <div className="row mt-5">
        {cart.map((p, index) => (
          <>
            <div key={index} className="col-md-2 mt-2">
              <Space size="middle">
                <Badge
                  count={p.quantity}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    border: "1px solid black",
                  }}
                >
                  <img
                    className={`img ${styling.productImg}`}
                    src={`${
                      process.env.REACT_APP_S3_HTTP_BUCKET_DEV
                    }/products/${p.categorySlug.toLowerCase()}/${p._id}-0.png`}
                    alt={p.name}
                  />
                </Badge>
              </Space>
            </div>
            <div key={index + 100} className="col-md-6">
              <div className={`${styling.bodyText}`}>
                <h4 className="">{p.name}</h4>
                <h5 className="">Color: {p.color}</h5>
                <h5 className="">Size: {p.size}</h5>
              </div>
            </div>
            <div key={index + 200} className="col-md-4">
              <div className={`${styling.bodyTextPrice}`}>
                <h4 className="">{p.price}€</h4>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
}

export { OrderSumm };
