const express = require("express");
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
} = require("../controllers/category");

// Route where you can create category
// CRUD operations
router.post("/category", requireSignIn, isAdmin, create);
router.put("/category/:categoryId", requireSignIn, isAdmin, update);
router.delete("/category/:categoryId", requireSignIn, isAdmin, remove);
router.get("/categories", list);
router.get("/category/:slug", read);
router.get("/products-by-category/:slug", productsByCategory);

module.exports = router;
