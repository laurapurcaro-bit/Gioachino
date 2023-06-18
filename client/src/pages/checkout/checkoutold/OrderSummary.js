import styling from "./OrderSummary.module.css";
import { Trans } from "react-i18next";

export default function OrderSummary({ cart, address, shipping }) {
  const currency = "EUR";
  const localString = "en-US";

  console.log("cart", cart);

  return (
    <div>
      <div className={styling.address}>
        <h2>
          <Trans>Address</Trans>
        </h2>
        <p>{address.street}</p>
        <p>{address.city}</p>
        <p>{address.zip}</p>
        <p>{address.country}</p>
      </div>
      <div className={styling.shipping}>
        <h2>
          <Trans>Shipping</Trans>
        </h2>
        <p>
          <Trans>{shipping}</Trans>
        </p>
      </div>
      <div className={styling.cart}>
        <h2>
          <Trans>Cart</Trans>
        </h2>
        <div className={styling.cartProducts}>
          {cart?.map((p, i) => (
            <>
              <div key={i} className="row g-0">
                <div className="col-md-4">
                  <img
                    className={styling.productImg}
                    src={`${
                      process.env.REACT_APP_S3_HTTP_BUCKET_DEV
                    }/products/${p?.categorySlug?.toLowerCase()}/${
                      p?._id
                    }-0.png`}
                    alt={"img"}
                    height="100%"
                    width="100%"
                  />
                </div>
                <div className="col-md-4">
                  <div className="card-body">
                    <h5 className="card-title"> {p.name} </h5>
                    <p className="card-text">
                      {p.description.length < 50
                        ? `${p.description}`
                        : `${p.description.substring(0, 50)}...`}
                    </p>
                    <p className="card-text">
                      {p?.price?.toLocaleString(localString, {
                        style: "currency",
                        currency: currency,
                      })}
                    </p>
                    {/* <p className="card-text">Quantity: {p.count}</p> */}
                    <p className="card-text">
                      <Trans>Quantity</Trans>: {p.quantity}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
