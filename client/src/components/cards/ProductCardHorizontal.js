import { Trans } from "react-i18next";

export default function ProductCartHorizontal({ p, removeFromCart }) {
  const currency = "EUR";
  const localString = "en-US";

  return (
    <div className="row g-0">
      <div className="col-md-4">
        <img
          src={`${
            process.env.REACT_APP_S3_HTTP_BUCKET_DEV
          }/products/${p.categorySlug.toLowerCase()}/${p._id}-0.png`}
          alt={p.name}
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
          <h5 className="card-title">
            <Trans>{p.name}</Trans>
          </h5>
          <div className="card-text">
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
          <p className="card-text">
            {p?.price?.toLocaleString(localString, {
              style: "currency",
              currency: currency,
            })}
          </p>
          {/* <p className="card-text">Quantity: {p.count}</p> */}
          <p className="card-text"><Trans>Quantity</Trans>: {p.quantity}</p>
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <p
          className="text-danger mb-2 pointer"
          onClick={() => removeFromCart(p)}
        >
          <Trans>Remove</Trans>
        </p>
      </div>
    </div>
  );
}
