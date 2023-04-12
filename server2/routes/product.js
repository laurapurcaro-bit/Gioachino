// Description: Routes for products
const express = require("express");
const formidable = require("express-formidable");
// Router function of express
const router = express.Router();

// middlewares
const { requireSignIn, isAdmin } = require("../middlewares/auth");
// controllers
const {
  create,
  list,
  read,
  photo,
  remove,
  update,
  filteredProducts,
  productsCount,
  listProducts,
  productSearch,
  relatedProducts,
} = require("../controllers/product");

// Route where you can create category
// Use formidable middleware to handle form data only in this route
router.post("/product", requireSignIn, isAdmin, formidable(), create);
router.get("/products", list);
router.get("/product/:slug", read);
router.get("/product/photo/:productId", photo);
router.delete("/product/:productId", requireSignIn, isAdmin, remove);
router.put("/product/:productId", requireSignIn, isAdmin, formidable(), update);
router.post("/filtered-products", filteredProducts);
router.get("/products-count", productsCount);
router.get("/list-products/:pageNumber", listProducts);
router.get("/products/search/:search", productSearch);
router.get("/products/related/:productId/:categoryId", relatedProducts);

module.exports = router;
