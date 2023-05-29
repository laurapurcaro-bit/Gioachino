const express = require("express");
const formidable = require("express-formidable");
// Router function of express
const router = express.Router();

// middlewares
const { requireSignIn, isAdmin } = require("../middlewares/auth");
// controllers
const {
  create,
  update,
  remove,
  list,
  read,
  productsByCategory,
  photo,
} = require("../controllers/category");

// Route where you can create category
// CRUD operations
router.post("/category", requireSignIn, isAdmin, formidable(), create);
router.put(
  "/category/:categoryId",
  requireSignIn,
  isAdmin,
  formidable(),
  update
);
router.delete("/category/:categoryId", requireSignIn, isAdmin, remove);
router.get("/category/photo/:categoryId", photo);
router.get("/categories", list);
router.get("/category/:slug", read);
router.get("/products-by-category/:slug", productsByCategory);

module.exports = router;
