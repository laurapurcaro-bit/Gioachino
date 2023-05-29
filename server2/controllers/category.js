// Description: This file contains the CRUD methods for the category model
const slugify = require("slugify");
const Category = require("../models/category");
const Product = require("../models/product");
const fs = require("fs");

const create = async (req, res) => {
  try {
    const { name } = req.fields;
    const { photo } = req.files;
    // Check if name is provided
    if (!name.trim()) {
      return res.json({ error: "Name is required" });
    }
    const existingCategory = await Category.findOne({ name });
    // Check if name exists
    if (existingCategory) {
      return res.json({ error: "Already exists" });
    }
    // Check if photo is provided
    if (!photo) {
      return res.json({ error: "Photo is required" });
    }

    const category = new Category({ name, slug: slugify(name) });
    // Add photo to category const
    if (photo) {
      console.log("Provided photo for category");
      category.photo.data = fs.readFileSync(photo.path);
      category.photo.contentType = photo.type;
    }
    // Save product to DB
    await category.save();
    res.json(category);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

const update = async (req, res) => {
  try {
    const { name } = req.fields;
    const { photo } = req.files;
    // We need the id because we use it to find the category
    const category = await Category.findByIdAndUpdate(
      req.params.categoryId,
      {
        name: name,
        slug: slugify(name),
      },
      // new: true will return the updated category
      { new: true }
    );
    // Add photo to product const
    if (photo) {
      category.photo.data = fs.readFileSync(photo.path);
      category.photo.contentType = photo.type;
    }
    // Save product to DB
    await category.save();
    res.json(category);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const remove = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.categoryId);
    res.json(category);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const list = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const read = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    res.json(category);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const productsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    const products = await Product.find({ category }).populate("category");

    res.json({ category, products });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const photo = async (req, res) => {
  try {
    // Get product by slug
    const category = await Category.findById(req.params.categoryId).select(
      "photo"
    );
    // If product exists
    if (category) {
      // If photo exists
      if (category.photo.data) {
        // Set content type
        res.set("Content-Type", category.photo.contentType);
        // Send photo data
        return res.send(category.photo.data);
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

module.exports = {
  create,
  update,
  remove,
  list,
  read,
  productsByCategory,
  photo,
};
