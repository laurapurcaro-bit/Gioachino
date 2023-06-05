// Description: This file contains the CRUD methods for the category model
const slugify = require("slugify");
const Category = require("../models/category");
const Product = require("../models/product");
const fs = require("fs");
const AWS = require("aws-sdk");

const AWSuploadCategoriesToS3 = async (filePath, categoryId, categoryName) => {
  // Configure AWS credentials and region
  AWS.config.update({ region: "eu-central-1" });
  const category = categoryName.toLowerCase();
  const s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    region: "eu-central-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  });
  // call S3 to retrieve upload file to specified bucket

  let uploadParams = { Bucket: `gioachino-dev/categories/${category}`, Key: "", Body: "", ACL: "public-read", ContentType: "image/png"};

  // Configure the file stream and obtain the upload parameters
  let fileStream = fs.createReadStream(filePath);
  fileStream.on("error", function (err) {
    console.log("File Error", err);
  });
  uploadParams.Body = fileStream;
  uploadParams.Key = categoryId + ".png";

  // call S3 to retrieve upload file to specified bucket
  s3.upload(uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    }
    if (data) {
      console.log("Upload Success", data.Location);
    }
  });
};

const create = async (req, res) => {
  try {
    const { name } = req.body;
    console.log(req.body);
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
    if (photo && photo[0].size > 1000000) {
      return res.json({ error: "Photo needs to be less then 1Mb" });
    }
    // Create category
    const category = new Category({ name, slug: slugify(name) });
    // Add photo to category const
    if (photo) {
      AWSuploadCategoriesToS3(photo[0].path, category._id, category.name)
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
    const { name } = req.body;
    console.log(req.body);
    const { photo } = req.files;
    console.log(req.files);
    // We need the id because we use it to find the category
    const category = await Category.findByIdAndUpdate(
      req.params.categoryId,
      {
        name: name,
        slug: slugify(name),
      },
      // new: true will return the updated category
      { new: true }
    ).select("-photo");

    if (photo && photo[0].size > 1000000) {
      return res.json({ error: "Photo needs to be less then 1Mb" });
    }
    // Add photo to product const
    if (photo) {
      AWSuploadCategoriesToS3(photo[0].path, category._id, category.name)
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
    const category = await Category.findByIdAndDelete(
      req.params.categoryId
    ).select("-photo");
    // Delete from S3
    res.json(category);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const list = async (req, res) => {
  try {
    const categories = await Category.find({}).select("-photo");
    res.json(categories);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const read = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).select(
      "-photo"
    );
    res.json(category);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const productsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).select(
      "-photo"
    );
    const products = await Product.find({ category })
      .select("-photo -additionalPhotos")
      .populate("category");

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
