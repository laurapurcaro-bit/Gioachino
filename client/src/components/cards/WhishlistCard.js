import styling from "./Whishlist.module.css";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Trans } from "react-i18next";

export default function Whishlist({ whishlist, handleRemoveWhishlist }) {

  return (
    <div className={`${styling.cardSavedItems}`}>
      <div onClick={() => handleRemoveWhishlist(whishlist)}>
        <span className={styling.close}>&times;</span>
      </div>
      <div className={`container-fluid ${styling.containerImage}`}>
        {Array.from(Array(5).keys()).map((index) => {
          const savedItem = whishlist.savedItems[index];
          return (
            <div key={index} className={`${styling.containerPreview}`}>
              {savedItem ? (
                <img
                  src={`${process.env.REACT_APP_S3_HTTP_BUCKET_DEV}/products/${whishlist.savedItems[index].category}/${whishlist.savedItems[index].productId}-0.png`}
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
          <p>{whishlist.savedItems.length} <Trans>products</Trans></p>
        ) : (
          <p>{whishlist.savedItems.length} <Trans>product</Trans></p>
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
