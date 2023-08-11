import { Trans, useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import styling from "./SavedItems.module.css";
import WhishlistsCards from "./WhishlistCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";

export default function SavedItems() {
  const [auth] = useAuth();
  const [showAddWishlist, setShowAddWishlist] = useState(false);
  const [wishlistName, setWishlistName] = useState("");
  const [whishlists, setWhishlists] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    loadWhishlists();
  }, []);

  const handleAddWishlist = () => {
    setShowAddWishlist(!showAddWishlist);
  };

  const handleWishlistNameChange = (e) => {
    setWishlistName(e.target.value);
  };

  const loadWhishlists = async () => {
    const { data } = await axios.get("/whishlists/read");
    console.log("WHISHLIST GOOD", data);
    if (data.error) {
      toast.error(data.error);
      return;
    }
    setWhishlists(data);
  };

  const handleRemoveWhishlist = async (whishlist) => {
    try {
      const wishlistId = whishlist._id;
      const { data } = await axios.delete(`/whishlists/delete/${wishlistId}`);
      console.log("WHISHLIST Rem", data, whishlists);
      setWhishlists(data);
    } catch (error) {
      console.error("Error deleting wishlist:", error);
      throw error;
    }
  };

  const handleAddWishlistConfirm = async () => {
    if (wishlistName.trim() !== "") {
      // Add your logic here to save the wishlist name
      const { data } = await axios.put("/whishlists/add", {
        newWhishlists: { name: wishlistName, savedItems: [] },
        provider: auth.user.provider || "email",
      });
      if (data.error) {
        toast.error(data.error);
        return;
      }
      toast.success(`Wishlist "${wishlistName}" added`);
      setWhishlists(data);
      setWishlistName("");
      setShowAddWishlist(false);
    } else {
      toast.error("Please enter a valid wishlist name");
    }
  };

  const handleClose = () => {
    setShowAddWishlist(false);
  };

  return (
    <div className={styling.wrap}>
      <div className="mt-5">
        <div className="text-center">
          <h1>
            <Trans>My Wishlist</Trans>
          </h1>
          <p>
            <Trans>Here you can find all the products you have saved for later.</Trans>
          </p>
          <button className={styling.whishlistBtn} onClick={handleAddWishlist}>
            <Trans>Add a new wishlist</Trans>
          </button>
          {showAddWishlist && (
            <div className={`${styling.greyOverlay}`}>
              <div className={`${styling.addWishlistPopup}`}>
                <div onClick={() => handleClose()}>
                  <span className={styling.close}>&times;</span>
                </div>
                <input type="text" value={wishlistName} onChange={handleWishlistNameChange} placeholder={t("enterWishlistName")} />
                <button onClick={handleAddWishlistConfirm}>
                  <Trans>Add</Trans>
                </button>
              </div>
            </div>
          )}
          <div className={`${styling.lineContainer}`}>
            <hr className={`${styling.line}`} />
          </div>
        </div>
        {/* Saved lists */}
        <div className={styling.savedLists}>
          {whishlists?.length > 0 ? (
            whishlists.map((whishlist) => <WhishlistsCards key={whishlist._id} whishlist={whishlist} handleRemoveWhishlist={handleRemoveWhishlist} />)
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
