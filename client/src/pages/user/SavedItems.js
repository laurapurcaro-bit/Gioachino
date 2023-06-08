import { Trans } from "react-i18next";
import toast from "react-hot-toast";
import styling from "./SavedItems.module.css";
import SavedItemsCard from "../../components/cards/SavedItemsCard";

export default function SavedItems() {
  return (
    <div>
      <div className="text-center">
        <h1>
          <Trans>My Wishlist</Trans>
        </h1>
        <p>
          <Trans>
            Here you can find all the products you have saved for later.
          </Trans>
        </p>
        <button
          className={styling.whishlistBtn}
          onClick={() => {
            toast.success(`Added to cart`);
          }}
        >
          Add a new wishlist
        </button>
        <div className={`${styling.lineContainer}`}>
          <hr className={`${styling.line}`} />
        </div>
      </div>
      {/* Saved lists */}
      <div className={styling.savedLists}>
        <SavedItemsCard />
        <SavedItemsCard />
      </div>
    </div>
  );
}
