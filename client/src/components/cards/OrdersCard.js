import { Trans } from "react-i18next";
import styling from "./OrdersCard.module.css"

export default function OrdersCard({ p }) {
  const currency = "EUR";
  const localString = "en-US";
  // console.log("ORDERS CARD", p);
  return (
    <div className="mb-3">
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={`${process.env.REACT_APP_S3_HTTP_BUCKET_DEV}/products/${p.category.slug}/${p._id}-0.png`}
            alt={p.name}
            style={{
              height: "80px",
              width: "80px",
              marginLeft: "0%",
              borderBottomRightRadius: "0px",
            }}
          />
        </div>
        <div className="col-md-4">
          <div className={styling.productText}>
            <h5 className="">
              {" "}
              <Trans>{p.name}</Trans>{" "}
            </h5>
            <p className="">
              {p?.price?.toLocaleString(localString, {
                style: "currency",
                currency: currency,
              })}
            </p>
            <p className="">
              <Trans>color</Trans>: {p.color}
            </p>
            <p className="">
              <Trans>size</Trans>: {p.size}
            </p>
            <p className="">
              <Trans>Quantity</Trans>: {p.quantity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
