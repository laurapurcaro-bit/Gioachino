import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";
import styling from "./ProductCard.module.css";
import { Trans } from "react-i18next";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { encryptData, decryptData, currencies } from "../../constants";
import axios from "axios";
import { useAuth } from "../../context/auth";

export default function ProductCard({ product }) {
  // const
  const inStock = product?.quantity; // - product?.sold;
  // const currency = "EUR";
  const localString = "en-US";
  // context
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  // hook
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  // console.log("PRODUCT", product);

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
      // console.log("PROD EX");
      // console.log("EXISTING PRODUCT", cartLs);
      // If the product exists, update the quantity
      const updatedCart = cartLs.map((item) => {
        // console.log("ITEM", item);
        if (item._id === product._id) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      // console.log("UPDATED CART", updatedCart);
      // localStorage.setItem("cart", JSON.stringify(updatedCart));
      encryptData(updatedCart, "cart");
      setCart(updatedCart);
    } else {
      // console.log("PROD NEW");
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

  const handleCreateWishilist = async (wishlistName, savedItems) => {
    if (wishlistName.trim() !== "") {
      // Add your logic here to save the wishlist name
      const { data } = await axios.put("/whishlists/add", {
        newWhishlists: { name: wishlistName, savedItems: savedItems },
        provider: auth.user.provider || "email",
      });
      if (data.error) {
        console.log(data.error);
        return;
      }
      // toast.success(`Wishlist "${wishlistName}" added`);
    } else {
      toast.error("An error occurred. Please try later.");
    }
  };

  const handleUpdateWishilist = async (wishlistName, savedItems) => {
    if (wishlistName.trim() !== "") {
      // Add your logic here to save the wishlist name
      const { data } = await axios.put("/whishlists/add", {
        newWhishlists: { name: wishlistName, savedItems: savedItems },
        provider: auth.user.provider || "email",
      });
      if (data.error) {
        console.log(data.error);
        return;
      }
    } else {
      toast.error("An error occurred. Please try later.");
    }
  };

  const handleHeartClick = (product, whishlistName) => {
    // add to local storage the saved item
    setIsSaved(!isSaved);
    // Add your logic to save the item to a list
    if (!isSaved) {
      // Add the saved items in local storage
      const savedItems = decryptData("itemSaved");

      let updatedItems = [];
      if (savedItems) {
        // If there are saved items, make a copy of the array
        updatedItems = [...savedItems];
      }
      // console.log("SAVED ITEMS", product);
      // Add the new product to the updated list
      updatedItems.push({
        whishlistName: whishlistName,
        productId: product._id,
        category: product?.categorySlug.toLowerCase(),
        isSaved: !isSaved,
      });
      // console.log("UPDATED SAVED ITEMS", updatedItems);
      // Save the updated list back to local storage
      // encrypt
      encryptData(updatedItems, "itemSaved");
      // Update the wishlist
      handleCreateWishilist(whishlistName, updatedItems);
    } else {
      // Remove selected saved item in local storage
      const savedItems = decryptData("itemSaved");

      let updatedItems = [];

      if (savedItems) {
        // Filter out the selected product from the saved items
        updatedItems = savedItems.filter(
          (item) => item.productId !== product._id
        );
      }
      // console.log("UPDATED ITEMS", updatedItems);
      // Save the updated list back to local storage and encrypt
      encryptData(updatedItems, "itemSaved");
      // Update the wishlist
      handleUpdateWishilist(whishlistName, updatedItems);
    }
    // e.g., dispatch an action or update the state
  };

  const currency = currencies?.find(
    (c) => c.name === product?.currency
  );

  return (
    <div className={`card ${styling.card}`}>
      <div className={`${styling.cardImageContainer}`}>
        {isSaved ? (
          <HeartFilled
            className={`${styling.heartIcon} ${styling.savedHeartIcon}`}
            onClick={(e) => handleHeartClick(product, "Wishlist")}
          />
        ) : (
          <HeartOutlined
            className={`${styling.heartIcon}`}
            onClick={(e) => handleHeartClick(product, "Wishlist")}
          />
        )}
        <img
          className="card-img-top"
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
      <div className={styling.colElements}>
        <div className={styling.cardElements}>
          <h3>{product?.name}</h3>
          <p>{product?.shortDesc}</p>
        </div>
        <h3>
          {product?.price}
          {currency?.value}
        </h3>
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
