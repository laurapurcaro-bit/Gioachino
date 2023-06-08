const router = require("express").Router();
// middlewares
const { requireSignIn } = require("../middlewares/auth");
// controllers
const {
  updateProfile,
  addAddress,
  deleteAddress,
  updateAddress,
} = require("../controllers/user");

router.put("/profile", requireSignIn, updateProfile);
router.put("/profile/addresses/add", requireSignIn, addAddress);
router.delete("/profile/addresses/delete", requireSignIn, deleteAddress);
router.put("/profile/addresses/update", requireSignIn, updateAddress);

module.exports = router;
