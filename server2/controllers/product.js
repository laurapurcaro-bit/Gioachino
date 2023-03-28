const Product = require("../models/product");
const slugify = require("slugify");
const fs = require("fs");

const create = async (req, res) => {
  try {
    // // Handle form data
    // console.log(req.fields);
    // // Handle image
    // console.log(req.files);
    // Make sure that required fields are sent
    const { name, price, description, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // if (!name.trim() || !price || !description || !category || !quantity || !shipping) {
    //   return res.status(400).json({
    //     error: "All fields are required",
    //   });
    // }
    // validation
    switch (true) {
      case !name.trim():
        res.json({ error: "Name is required" });
        break;
      case !description.trim():
        res.json({ error: "Description is required" });
        break;
      case !price.trim():
        res.json({ error: "Price is required" });
        break;
      case !category.trim():
        res.json({ error: "Category is required" });
        break;
      case !quantity.trim():
        res.json({ error: "Quantity is required" });
        break;
      case !shipping.trim():
        res.json({ error: "Shipping is required" });
        break;
      // No bigger than 1MB
      case photo && photo.size > 1000000:
        res.json({ error: "Photo needs to be less then 1Mb" });
        break;
    }
    // Create product
    // ...: spread operator, copy all the properties of req.fields
    const product = new Product({ ...req.fields, slug: slugify(name) });
    // Add photo to product const
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    // Save product to DB
    await product.save();
    res.json(product);
    // Catch error
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const list = async (req, res) => {
  try {
    // Get all products
    // select(): Select everything except photo data
    // limit(): Limit the number of products to 12
    // sort(): Sort by createdAt in descending order, the most recent product will be at the top: -1
    const products = await Product.find({})
      // Populate is for getting the category object
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const read = async (req, res) => {
  try {
    // Get product by slug
    // select(): Select everything except photo data
    const product = await Product.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.json(product);
  } catch (error) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const photo = async (req, res) => {
  try {
    // Get product by slug
    const product = await Product.findById(req.params.productId).select(
      "photo"
    );
    // If product exists
    if (product) {
      // If photo exists
      if (product.photo.data) {
        // Set content type
        res.set("Content-Type", product.photo.contentType);
        // Send photo data
        return res.send(product.photo.data);
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const remove = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.productId
    ).select("-photo");
    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const update = async (req, res) => {
  try {
    // // Handle form data
    // console.log(req.fields);
    // // Handle image
    // console.log(req.files);
    // Make sure that required fields are sent
    const { name, price, description, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // validation
    switch (true) {
      case !name.trim():
        res.json({ error: "Name is required" });
        break;
      case !description.trim():
        res.json({ error: "Description is required" });
        break;
      case !price.trim():
        res.json({ error: "Price is required" });
        break;
      case !category.trim():
        res.json({ error: "Category is required" });
        break;
      case !quantity.trim():
        res.json({ error: "Quantity is required" });
        break;
      case !shipping.trim():
        res.json({ error: "Shipping is required" });
        break;
      // No bigger than 1MB
      case photo && photo.size > 1000000:
        res.json({ error: "Photo needs to be less then 1Mb" });
        break;
    }
    // Update product
    // ...: spread operator, copy all the properties of req.fields
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        ...req.fields,
        slug: slugify(name),
      },
      // new: true: return the updated product
      { new: true }
    );
    // Add photo to product const
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    // Save product to DB
    await product.save();
    res.json(product);
    // Catch error
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

module.exports = { create, list, read, photo, remove, update };
