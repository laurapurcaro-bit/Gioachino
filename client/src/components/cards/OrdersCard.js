export default function OrdersCard({ p }) {
  const currency = "EUR";
  const localString = "en-US";
  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={`${process.env.REACT_APP_API}/product/photo/${p._id}`}
            alt={p.info[0].name}
            style={{
              height: "100%",
              width: "90%",
              // fix this!!!!!!!
              // objectFit: "cover",

              marginLeft: "0%",
              borderBottomRightRadius: "0px",
            }}
          />
        </div>
        <div className="col-md-4">
          <div className="card-body">
            <h5 className="card-title"> {p.info[0].name} </h5>
            <p className="card-text">
              {p.info[0].description.length < 50
                ? `${p.info[0].description}`
                : `${p.info[0].description.substring(0, 50)}...`}
            </p>
            <p className="card-text">
              {p?.info[0].price?.toLocaleString(localString, {
                style: "currency",
                currency: currency,
              })}
            </p>
            <p className="card-text">Quantity: {p.count}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
