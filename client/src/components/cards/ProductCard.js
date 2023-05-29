// import moment from "moment";
import { Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";
import styling from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  // context
  const [cart, setCart] = useCart();
  // hook
  const navigate = useNavigate();

  function productDesc(description) {
    if (description?.length < 60) {
      return description;
    } else {
      return description?.substring(0, 60) + "...";
    }
  }

  const inStock = product?.quantity; // - product?.sold;
  const currency = "EUR";
  const localString = "en-US";
  return (
    <div className={`card ${styling.card}`}>
      <Badge.Ribbon
        text={`${product?.quantity >= 1 ? `${inStock} in stock` : "Out of Stock"}`}
        placement="start"
        color={`${product?.quantity >= 1 ? "green" : "red"}`}
      >
        <img
          className="card-img-top"
          src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
          alt={product?.name}
          // className="img img-responsive"
          height="300px"
          width="230px"
          style={{ objectFit: "cover" }}
        />
      </Badge.Ribbon>

      <div className="card-body">
        <h3>{product?.name}</h3>
        <h2 className="fw-bold">
          {product?.price?.toLocaleString(localString, {
            style: "currency",
            currency: currency,
          })}
        </h2>
        {/* <p className="card-text">{productDesc(product?.description)}</p> */}
      </div>
      <div className="d-flex">
        <button
          className={`btn ${styling.btn} ${styling.add}`}
          onClick={() => {
            setCart([...cart, product]);
            localStorage.setItem("cart", JSON.stringify([...cart, product]));
            toast.success(`${product.name} added to cart`);
          }}
        >
          ADD
        </button>
        <button className={`btn ${styling.btn} ${styling.view}`} onClick={() => navigate(`/product/${product.slug}`)}>
          VIEW
        </button>
      </div>
    </div>
  );
}
