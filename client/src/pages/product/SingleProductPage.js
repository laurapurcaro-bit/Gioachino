import { useState, useEffect } from "react";
import { Badge } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";
import styling from "./SingleProductPage.module.css";

// Single product page
export default function SingleProductPage() {
  // context
  const [cart, setCart] = useCart();
  // state
  const [product, setProduct] = useState({});
  const [productPhotos, setProductPhotos] = useState([]);
  // const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(0);
  // hook
  const params = useParams();
  //   const
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
      // const { data } = await axios.get(`/products/related/${productId}/${categoryId}`);
      // setRelatedProducts(data);
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

  // function changeImage(imagePath) {
  //   let mainImage = document.querySelector(".mainImage img");
  //   mainImage.src = imagePath;
  // }

  return (
    <div className={styling.productPage}>
      <div className={styling.imageSection}>
        <div className={styling.imgRepo}>
          <img
            src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
            alt={product?.name}
            // onclick={changeImage(`${process.env.REACT_APP_API}/product/photo/${product._id}`)}
          />
          <img
            src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
            alt={product?.name}
            // onclick={changeImage(`${process.env.REACT_APP_API}/product/photo/${product._id}`)}
          />
          <img
            src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
            alt={product?.name}
            // onclick={changeImage(`${process.env.REACT_APP_API}/product/photo/${product._id}`)}
          />
        </div>
        <div className={styling.mainImage}>
          <img
            // className={styling.mainImage}
            src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
            alt={product?.name}
          />
        </div>
      </div>
      <div className={styling.productDetails}>
        {product?.stock < 1 && (
          <div>
            <span className={styling.esaurito}>ESAURITO</span>
          </div>
        )}
        <div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
        </div>
        <div className={styling.quantitySection}>
          <span className={styling.quantitySpan}>
            <p>Quantita</p>
            <span>
              <button onClick={handleDecreaseQuantity}>-</button>
              <p>{quantity}</p>
              <button onClick={handleIncreaseQuantity}>+</button>
            </span>
          </span>
          <button
            className={styling.quantityBtn}
            onClick={() => {
              addToCart(product);
              toast.success(`${product.name} added to cart`);
            }}
          >
            AGGIUNGI AL CARRELLO
          </button>
        </div>
      </div>
    </div>
  );
}
