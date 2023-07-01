import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import styling from "./SingleWhishlist.module.css";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { HeartOutlined, HeartFilled, ArrowLeftOutlined } from "@ant-design/icons";
import { encryptData, decryptData, currencies } from "../../constants";
import { toast } from "react-hot-toast";

export default function SingleWhishlist() {
  // context
  const params = useParams();
  const [auth] = useAuth();
  const navigate = useNavigate();
  // hooks
  const [whishlist, setWhishlist] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (params?.whishlistId) {
      loadWhishlist();
    }
    // make request only when slug changes
    // eslint-disable-next-line
  }, [params?.whishlistId]);

  const loadWhishlist = async () => {
    try {
      const { data } = await axios.post(`/whishlist/${params.whishlistId}`, {
        userId: auth?.user?._id,
      });
      setWhishlist(data);
      console.log("Wh!", data);
      loadProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadProduct = async (whishlist) => {
    const productIds = whishlist?.savedItems?.map((item) => item?.productId);
    console.log("productIds", productIds);
    try {
      const { data } = await axios.post(`/product/read`, {
        ids: productIds,
      });
      console.log("data", data);
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const navigateToWhishlist = () => {
    navigate("/logged/whishlist");
  };

  return (
    <div>
      <div className={styling.return} onClick={navigateToWhishlist}>
        <p>
          <ArrowLeftOutlined style={{ fontSize: "1.5rem" }} />
        </p>
        <p>Return to whishlists</p>
      </div>
      <div className={styling.whishlistName}>
        <h1>{whishlist.name}</h1>
        <hr />
        <WhishlistProducts auth={auth} whishlist={whishlist} setWhishlist={setWhishlist} products={products} />
      </div>
    </div>
  );
}

function WhishlistProducts({ auth, whishlist, setWhishlist, products }) {
  // state
  const [isSaved, setIsSaved] = useState(true);

  const handleHeartClick = (product, whishlistName) => {
    // add to local storage the saved item
    setIsSaved(!isSaved);
    // Add your logic to save the item to a list
    // Remove selected saved item in local storage
    const savedItems = decryptData("itemSaved");

    let updatedItems = [];
    console.log("savedItems", savedItems);
    console.log("product", product);
    if (savedItems) {
      // Filter out the selected product from the saved items
      updatedItems = savedItems.filter((item) => item.productId !== product.productId);
    }
    console.log("updatedItems", updatedItems);
    // Save the updated list back to local storage and encrypt
    encryptData(updatedItems, "itemSaved");
    // Update the setWhishlist
    // Update the whishlist state by creating a new object with updated savedItems
    const updatedWhishlist = {
      ...whishlist,
      savedItems: updatedItems,
    };

    // Call the setWhishlist function to update the state with the updatedWhishlist object
    setWhishlist(updatedWhishlist);
    // Update whishlist in the database
    handleUpdateWishilist(whishlistName, updatedItems);
  };

  const handleUpdateWishilist = async (wishlistName, savedItems) => {
    if (wishlistName.trim() !== "") {
      // Add your logic here to save the wishlist name
      const { data } = await axios.put("/whishlists/add", {
        newWhishlists: { name: wishlistName, savedItems: savedItems },
        provider: auth?.user?.provider || "email",
      });
      if (data.error) {
        console.log(data.error);
        return;
      }
    } else {
      toast.error("An error occurred. Please try later.");
    }
  };

  return (
    <div className={styling.wrap}>
      <div className={`${styling.containerPreview}`}>
        {whishlist?.savedItems?.map((item, index) => {
          const product = products.find((p) => p._id === item.productId);
          // Find the corresponding currency value
          const currency = currencies?.find((c) => c.name === product?.currency);
          return (
            <div key={index} className={styling.cardContainer}>
              {item ? (
                <>
                  <div className={`${styling.cardImageContainer}`}>
                    {isSaved ? (
                      <HeartFilled
                        className={`${styling.heartIcon} ${styling.savedHeartIcon}`}
                        onClick={(e) => handleHeartClick(item, whishlist.name)}
                      />
                    ) : (
                      <HeartOutlined className={`${styling.heartIcon}`} onClick={(e) => handleHeartClick(item, whishlist.name)} />
                    )}
                    <img
                      className={`card-img-top ${styling.img}`}
                      src={`${process.env.REACT_APP_S3_HTTP_BUCKET_DEV}/products/${item.category}/${item.productId}-0.png`}
                      alt={"img"}
                      height="100%"
                      width="100%"
                    />
                  </div>
                  <div className={styling.colElements}>
                    <div className={styling.cardElements}>
                      <h5>{product?.name}</h5>
                      <p>{product?.shortDesc}</p>
                    </div>
                    <p>
                      {product?.price}
                      {currency?.value}
                    </p>
                  </div>
                </>
              ) : (
                <p></p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
