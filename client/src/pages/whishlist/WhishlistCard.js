import styling from "./WhishlistCard.module.css";
import { ArrowRightOutlined, DeleteOutlined } from "@ant-design/icons";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function WhishlistsCards({ whishlist, handleRemoveWhishlist }) {
  const navigate = useNavigate();

  const handleShowWhishlist = () => {
    navigate(`/logged/whishlist/${whishlist.uniqueId}`);
  };

  return (
    <div className={`${styling.cardSavedItems}`}>
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
          <p>
            {whishlist.savedItems.length} <Trans>products</Trans>
          </p>
        ) : (
          <p>
            {whishlist.savedItems.length} <Trans>product</Trans>
          </p>
        )}
      </div>
      <div className={`container-fluid ${styling.containerButton}`}>
        <button onClick={() => handleRemoveWhishlist(whishlist)}>
          <DeleteOutlined className={styling.delete} />
        </button>

        <button onClick={handleShowWhishlist}>
          <ArrowRightOutlined />
        </button>
      </div>
    </div>
  );
}
