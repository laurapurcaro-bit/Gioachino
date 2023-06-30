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
  additionalPhotos,
  readProducts,
} = require("../controllers/product");

const multer = require("multer");
const path = require("path");
const uploadDir = path.join("/Users/laurap/Documents/ecom22/Gioachino/client/src", "images");
console.log(uploadDir);

// Create a storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Specify the destination folder for file uploads
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Generate a unique filename for the uploaded file
  },
});

// Create the multer middleware with the specified storage engine
const upload = multer({ storage: storage });

// Route where you can create category
// Use formidable middleware to handle form data only in this route
router.post(
  "/product/create",
  requireSignIn,
  isAdmin,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "additionalPhotos", maxCount: 3 },
  ]),
  create
);
router.get("/products", list);
router.get("/product/:slug", read);
router.get("/product/photo/:productId", photo);
router.delete("/product/:productId", requireSignIn, isAdmin, remove);
router.put(
  "/product/update/:productId",
  requireSignIn,
  isAdmin,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "additionalPhotos", maxCount: 3 },
  ]),
  update
);
router.post("/filtered-products", filteredProducts);
router.get("/products-count", productsCount);
router.get("/list-products/:pageNumber", listProducts);
router.get("/products/search/:search", productSearch);
router.get("/products/related/:productId/:categoryId", relatedProducts);
router.get("/product/additionalPhotos/:slug", additionalPhotos);
router.post("/product/read", readProducts);

module.exports = router;
