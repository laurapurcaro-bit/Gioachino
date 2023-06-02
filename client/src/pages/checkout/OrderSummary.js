import styling from "./OrderSummary.module.css";

export default function OrderSummary({ cart, address, shipping }) {
  const currency = "EUR";
  const localString = "en-US";

  console.log("address", address);

  return (
    <div>
      <div className={styling.address}>
        <h2>Address</h2>
        <p>{address.street}</p>
        <p>{address.city}</p>
        <p>{address.zip}</p>
        <p>{address.state}</p>
      </div>
      <div className={styling.shipping}>
        <h2>Shipping</h2>
        <p>{shipping}</p>
      </div>
      <div className={styling.cart}>
        <h2>Cart</h2>
        <div className={styling.cartProducts}>
          {cart?.map((p, i) => (
            <>
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
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
