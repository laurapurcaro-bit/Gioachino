import styling from "./Whishlist.module.css";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { decryptData } from "../../constants";

export default function Whishlist({ whishlist, handleRemoveWhishlist }) {
  // state
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    loadSavedItemsPreview();
  }, []);

  const loadSavedItemsPreview = () => {
    const savedItems = decryptData("itemSaved");
    if (savedItems) {
      setSavedItems(savedItems);
    }
  };

  return (
    <div className={`${styling.cardSavedItems}`}>
      <div onClick={() => handleRemoveWhishlist(whishlist)}>
        <span className={styling.close}>&times;</span>
      </div>
      <div className={`container-fluid ${styling.containerImage}`}>
        {Array.from(Array(5).keys()).map((index) => {
          const savedItem = savedItems[index];
          return (
            <div key={index} className={`${styling.containerPreview}`}>
              {savedItem ? (
                <img
                  src={`${process.env.REACT_APP_S3_HTTP_BUCKET_DEV}/products/${savedItems[index].category}/${savedItems[index].productId}-0.png`}
                  alt={"img"}
                  height="100%"
                  width="100%"
                />
              ) : (
                <p></p>
              )}
            </div>
          );
        })}
      </div>
      <div className={`container-fluid ${styling.textWhishlist}`}>
        <h3>{whishlist.name}</h3>
        {whishlist.savedItems.length > 1 ? (
          <p>{whishlist.savedItems.length} products</p>
        ) : (
          <p>{whishlist.savedItems.length} product</p>
        )}
      </div>
      <div className={`container-fluid ${styling.containerButton}`}>
        <button className={`${styling.button}`}>
          <ArrowRightOutlined />
        </button>
      </div>
    </div>
  );
}
