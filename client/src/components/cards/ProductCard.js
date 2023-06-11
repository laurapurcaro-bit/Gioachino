import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";
import styling from "./ProductCard.module.css";
import { Trans } from "react-i18next";
import { HeartOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { encryptData, decryptData } from "../../constants";

export default function ProductCard({ product }) {
  // const
  const inStock = product?.quantity; // - product?.sold;
  const currency = "EUR";
  const localString = "en-US";
  // context
  const [cart, setCart] = useCart();
  // hook
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  console.log("PRODUCT", product);

  useEffect(() => {
    // Check if the product is saved
    const savedItem = decryptData("itemSaved");
    // const savedItem = JSON.parse(localStorage.getItem("itemSaved"));
    if (savedItem) {
      savedItem.forEach((element) => {
        if (element.productId === product._id && element.isSaved) {
          setIsSaved(true);
        }
      });
    }
  }, []);

  function productDesc(description) {
    if (description?.length < 60) {
      return description;
    } else {
      return description?.substring(0, 60) + "...";
    }
  }

  const addToCart = (product) => {
    // Check if the product already exists in the cart
    // const cartLs = JSON.parse(localStorage.getItem("cart")) || [];
    const cartLs = decryptData("cart") || [];
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
      // localStorage.setItem("cart", JSON.stringify(updatedCart));
      encryptData(updatedCart, "cart");
      setCart(updatedCart);
    } else {
      console.log("PROD NEW");
      // If the product does not exist, quantity is 0, so we add 1
      const newProduct = { ...product, quantity: 1 };
      const updatedCart = [...cart, newProduct];
      // If the product does not exist, add it to the cart
      // const updatedCart = [...cart, product];
      setCart(updatedCart);
      // localStorage.setItem("cart", JSON.stringify(updatedCart));
      encryptData(updatedCart, "cart");
    }
  };

  const handleHeartClick = (product) => {
    // add to local storage the saved item
    setIsSaved(!isSaved);
    // Add your logic to save the item to a list
    if (!isSaved) {
      // Get the saved items from local storage
      const savedItems = decryptData("itemSaved");

      let updatedItems = [];
      if (savedItems) {
        // If there are saved items, make a copy of the array
        updatedItems = [...savedItems];
      }
      console.log("SAVED ITEMS", product);
      // Add the new product to the updated list
      updatedItems.push({
        productId: product._id,
        category: product?.categorySlug.toLowerCase(),
        isSaved: !isSaved,
      });
      console.log("UPDATED ITEMS", updatedItems);
      // Save the updated list back to local storage
      // localStorage.setItem("itemSaved", JSON.stringify(updatedItems));
      // encrypt
      encryptData(updatedItems, "itemSaved");
    } else {
      // Remove selected saved item from local storage
      const savedItems = decryptData("itemSaved");
      // const savedItems = JSON.parse(localStorage.getItem("itemSaved"));
      let updatedItems = [];

      if (savedItems) {
        // Filter out the selected product from the saved items
        updatedItems = savedItems.filter(
          (item) => item.productId !== product._id
        );
      }
      console.log("UPDATED ITEMS", updatedItems);
      // Save the updated list back to local storage
      // localStorage.setItem("itemSaved", JSON.stringify(updatedItems));
      // encrypt
      encryptData(updatedItems, "itemSaved");
    }
    // e.g., dispatch an action or update the state
  };

  return (
    <div className={`card ${styling.card}`}>
      <div className={`${styling.cardImageContainer}`}>
        <HeartOutlined
          className={`${styling.heartIcon} ${
            isSaved ? styling.savedHeartIcon : ""
          }`}
          onClick={(e) => handleHeartClick(product)}
        />
        <img
          className="card-img-top"
          // src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
          src={`${
            process.env.REACT_APP_S3_HTTP_BUCKET_DEV
          }/products/${product.categorySlug.toLowerCase()}/${
            product._id
          }-0.png`}
          alt={product?.name}
          // className="img img-responsive"
          height="300px"
          width="200px"
          style={{ objectFit: "cover" }}
        />
      </div>
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
