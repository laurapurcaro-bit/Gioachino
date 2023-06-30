const router = require("express").Router();
const formidable = require("express-formidable");
// middlewares
const { requireSignIn } = require("../middlewares/auth");
// controllers
const {
  updateProfile,
  addAddress,
  deleteAddress,
  updateAddress,
  updateWhishlists,
  readWhishlists,
  readWhishlistId,
  deleteWhishlist,
  getLatestShippingAddress,
  getLatestBillingAddress,
  saveUserInfoCheckout
} = require("../controllers/user");

router.put("/profile", requireSignIn, updateProfile);
router.put("/profile/addresses/add", requireSignIn, addAddress);
router.delete("/profile/addresses/delete", requireSignIn, deleteAddress);
router.put("/profile/addresses/update", requireSignIn, updateAddress);
router.get("/profile/shipping-addresses/latest", requireSignIn, getLatestShippingAddress);
router.get("/profile/billing-addresses/latest", requireSignIn, getLatestBillingAddress);
router.post("/profile/addresses/checkout", requireSignIn, saveUserInfoCheckout);
router.put("/whishlists/add", requireSignIn, updateWhishlists);
router.get("/whishlists/read", requireSignIn, readWhishlists);
router.delete("/whishlists/delete/:wishlistId", requireSignIn, deleteWhishlist);
router.post("/whishlist/:whishlistId", readWhishlistId);

module.exports = router;
