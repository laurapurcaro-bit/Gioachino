import { Trans } from "react-i18next";
import toast from "react-hot-toast";
import styling from "./SavedItems.module.css";
import Whishlist from "../../components/cards/WhishlistCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";

export default function SavedItems() {
  const [auth] = useAuth();
  const [showAddWishlist, setShowAddWishlist] = useState(false);
  const [wishlistName, setWishlistName] = useState("");
  const [whishlists, setWhishlists] = useState([]);

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
        newWhishlists: { name: wishlistName },
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
        <button className={styling.whishlistBtn} onClick={handleAddWishlist}>
          Add a new wishlist
        </button>
        {showAddWishlist && (
          <div className={`${styling.greyOverlay}`}>
            <div className={`${styling.addWishlistPopup}`}>
              <input
                type="text"
                value={wishlistName}
                onChange={handleWishlistNameChange}
                placeholder="Enter wishlist name"
              />
              <button onClick={handleAddWishlistConfirm}>Add</button>
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
          whishlists.map((whishlist) => (
            <Whishlist key={whishlist._id} whishlist={whishlist} handleRemoveWhishlist={handleRemoveWhishlist} />
          ))
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}