import { Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";
import styling from "./ProductCard.module.css";
import { Trans } from "react-i18next";

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

  const addToCart = (product) => {
    // Check if the product already exists in the cart
    const cartLs = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cartLs.find((item) => {
      return item._id === product._id;
    });

    if (existingProduct) {
      console.log("PROD EX");
      console.log("EXISTING PRODUCT", cartLs);
      // If the product exists, update the quantity
      const updatedCart = cartLs.map((item) => {
        console.log("ITEM", item);
        if (item._id === product._id) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      console.log("UPDATED CART", updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
    } else {
      console.log("PROD NEW");
      // If the product does not exist, quantity is 0, so we add 1
      const newProduct = { ...product, quantity: 1 };
      const updatedCart = [...cart, newProduct];
      // If the product does not exist, add it to the cart
      // const updatedCart = [...cart, product];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const inStock = product?.quantity; // - product?.sold;
  const currency = "EUR";
  const localString = "en-US";
  return (
    <div className={`card ${styling.card}`}>
      <Badge.Ribbon
        text={`${
          product?.quantity >= 1 ? `${inStock} in stock` : "Out of Stock"
        }`}
        placement="start"
        color={`${product?.quantity >= 1 ? "green" : "red"}`}
      >
        <img
          className="card-img-top"
          // src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
          src={`${
            process.env.REACT_APP_S3_HTTP_BUCKET_DEV
          }/products/${product.categorySlug.toLowerCase()}/${
            product._id
          }-main.png`}
          alt={product?.name}
          // className="img img-responsive"
          height="300px"
          width="230px"
          style={{ objectFit: "cover" }}
        />
      </Badge.Ribbon>

      <div className="card-body">
        <h3>
          <Trans>{product?.name}</Trans>
        </h3>
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
            addToCart(product);
            toast.success(`${product.name} added to cart`);
          }}
        >
          <span className={`${styling.addText}`}>
            <Trans>ADD</Trans>
          </span>
        </button>
        <button
          className={`btn ${styling.btn} ${styling.view}`}
          onClick={() => navigate(`/product/${product.slug}`)}
        >
          <Trans>VIEW</Trans>
        </button>
      </div>
    </div>
  );
}
