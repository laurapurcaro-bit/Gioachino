import { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/cards/ProductCard";
import { Badge } from "antd";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";
import styling from "./SingleProductPage.module.css";

// Single product page
export default function SingleProductPage() {
  // context
  const [cart, setCart] = useCart();
  // state
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(0);
  // hook
  const params = useParams();
  //   const
  const inStock = product?.quantity; //- product?.sold;
  const currency = "EUR";
  const localString = "en-US";
  useEffect(() => {
    // const slug = window.location.pathname.split("/")[2];
    if (params?.slug) {
      loadProduct();
    }
    // make request only when slug changes
    // eslint-disable-next-line
  }, [params?.slug]);

  const loadProduct = async (req, res) => {
    try {
      const { data } = await axios.get(`/product/${params.slug}`);
      setProduct(data);
      // load related products when product is loaded
      loadRelatedProducts(data._id, data.category._id);
      console.log("PRODUCT!", data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadRelatedProducts = async (productId, categoryId) => {
    try {
      const { data } = await axios.get(
        `/products/related/${productId}/${categoryId}`
      );
      setRelatedProducts(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
    product.quantity = product.quantity + 1;
    // USE CART CONTEXT
    setProduct((prev) => ({ ...prev, product }));
    console.log("PRODUCT +", product);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      product.quantity = product.quantity - 1;
      setProduct((prev) => ({ ...prev, product }));
      console.log("PRODUCT -", product);
    }
  };

  // const addToCart = (product) => {
  //   // Check if the product already exists in the cart
  //   const cartLs = JSON.parse(localStorage.getItem("cart")) || [];
  //   const existingProduct = cartLs.find((item) => {
  //     return item._id === product._id
  //   });

  //   if (existingProduct) {
  //     console.log("PROD EX");
  //     console.log("EXISTING PRODUCT", cartLs);
  //     // If the product exists, update the quantity
  //     const updatedCart = cartLs.map((item) => {
  //       if (item._id === product._id) {
  //         return {
  //           ...item,
  //           quantity: item.quantity + product.quantity,
  //         };
  //       }
  //       return item;
  //     });
  //     console.log("UPDATED CART", updatedCart);
  //     localStorage.setItem("cart", JSON.stringify(updatedCart));
  //     setCart(updatedCart);
  //   } else {
  //     console.log("PROD NEW");
  //     // If the product does not exist, add it to the cart
  //     const updatedCart = [...cart, product];
  //     setCart(updatedCart);
  //     localStorage.setItem("cart", JSON.stringify(updatedCart));
  //   }
  // };
  const addToCart = (product) => {
    // Check if the product already exists in the cart
    const cartLs = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cartLs.findIndex(
      (item) => item._id === product._id
    );
    // If no element is found, it returns -1
    if (existingProductIndex !== -1) {
      console.log("PROD EX");
      console.log("EXISTING PRODUCT", cartLs);
      // If the product exists, update the quantity
      const updatedCart = [...cartLs];
      updatedCart[existingProductIndex].quantity += product.quantity;

      console.log("UPDATED CART", updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
    } else {
      console.log("PROD NEW");
      // If the product does not exist, add it to the cart
      const updatedCart = [...cart, product];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  return (
    <div className={styling.productPage}>
      <div className={styling.imageSection}>
        <img
          className={styling.mainImage}
          src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
          alt={product?.name}
          // className="img img-responsive"
          height="300px"
          width="230px"
          style={{ height: "600px", width: "100%" }}
        />
        <div className={styling.additionalImages}>
          {/* {product.additionalImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={product.name}
              className="additional-image"
            />
          ))} */}
        </div>
      </div>
      <div className={styling.productDetails}>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <div className={styling.quantitySection}>
          <button onClick={handleDecreaseQuantity}>-</button>
          <span>{quantity}</span>
          <button onClick={handleIncreaseQuantity}>+</button>
        </div>
        <button
          className="btn btn-outline-primary col card-button-footer"
          style={{ borderBottomRightRadius: "5px" }}
          onClick={() => {
            // setCart([...cart, product]);
            addToCart(product);
            toast.success(`${product.name} added to cart`);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
