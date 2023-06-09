const router = require("express").Router();
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
  deleteWhishlist,
} = require("../controllers/user");

router.put("/profile", requireSignIn, updateProfile);
router.put("/profile/addresses/add", requireSignIn, addAddress);
router.delete("/profile/addresses/delete", requireSignIn, deleteAddress);
router.put("/profile/addresses/update", requireSignIn, updateAddress);
router.put("/whishlists/add", requireSignIn, updateWhishlists);
router.get("/whishlists/read", requireSignIn, readWhishlists);
router.delete("/whishlists/delete/:wishlistId", requireSignIn, deleteWhishlist);

module.exports = router;
