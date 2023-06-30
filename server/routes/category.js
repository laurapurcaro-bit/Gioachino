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

const multer = require("multer");
const path = require("path");
const uploadDir = path.join(
  "/Users/laurap/Documents/ecom22/Gioachino/client/src",
  "images"
);

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
// CRUD operations
router.post(
  "/category",
  requireSignIn,
  isAdmin,
  upload.fields([
    { name: "photo", maxCount: 1 },
  ]),
  create
);
router.put(
  "/category/:categoryId",
  requireSignIn,
  isAdmin,
  upload.fields([
    { name: "photo", maxCount: 1 },
  ]),
  update
);
router.delete("/category/:categoryId", requireSignIn, isAdmin, remove);
router.get("/category/photo/:categoryId", photo);
router.get("/categories", list);
router.get("/category/:slug", read);
router.get("/products-by-category/:slug", productsByCategory);

module.exports = router;
