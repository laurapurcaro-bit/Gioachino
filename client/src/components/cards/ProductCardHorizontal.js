import moment from "moment";

export default function ProductCartHorizontal({ p, removeFromCart }) {
  const currency = "EUR";
  const localString = "en-US";

  return (
    <div className="row g-0">
      <div className="col-md-4">
        <img
          src={`${process.env.REACT_APP_API}/product/photo/${p._id}`}
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
          <p className="card-text">Quantity: {p.quantity}</p>
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <p className="card-text">
          <small className="text-muted">
            Listed {moment(p.createdAt).fromNow()}
          </small>
        </p>
        <p
          className="text-danger mb-2 pointer"
          onClick={() => removeFromCart(p._id)}
        >
          Remove
        </p>
      </div>
    </div>
  );
}
