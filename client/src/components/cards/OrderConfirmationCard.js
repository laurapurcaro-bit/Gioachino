import { Trans } from "react-i18next";
import styling from "./OrderConfirmationCard.module.css";

export default function OrdersCard({ p }) {
  const currency = "EUR";
  const localString = "en-US";
  // console.log("ORDERS CARD", p);
  return (
    <>
      <div className={styling.containerSingleProduct}>
        <div className="row">
          <div className="col-md-4">
            <img
              className={styling.imageProduct}
              src={`${
                process.env.REACT_APP_S3_HTTP_BUCKET_DEV
              }/products/${p?.categorySlug?.toLowerCase()}/${p._id}-0.png`}
              alt={p.name}
            />
          </div>
          <div className="col-md-4">
            <div className="card-body">
              <h5 className="card-title">
                {" "}
                <Trans>{p.name}</Trans>{" "}
              </h5>
              <p className="card-text">
                {p.description?.length < 50 ? (
                  <p>
                    <Trans>{p?.description}</Trans>
                  </p>
                ) : (
                  <p>
                    <Trans>{p?.description?.substring(0, 50)}...</Trans>
                  </p>
                )}
              </p>
              <p className="card-text">
                {p?.price?.toLocaleString(localString, {
                  style: "currency",
                  currency: currency,
                })}
              </p>
              <p className="card-text">
                <Trans>Quantity</Trans>: {p.quantity}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
