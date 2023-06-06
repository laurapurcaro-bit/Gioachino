// Description: This file contains the CRUD methods for the category model
const slugify = require("slugify");
const Category = require("../models/category");
const Product = require("../models/product");
const fs = require("fs");
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client } = require("@aws-sdk/client-s3");

const AWSuploadCategoriesToS3 = async (filePath, categoryId, categoryName) => {
  const category = slugify(categoryName.toLowerCase());
  // Configure the file stream and obtain the upload parameters
  let fileStream = fs.createReadStream(filePath);
  fileStream.on("error", function (err) {
    console.log("File Error", err);
  });
  // Configure AWS credentials
  await new Upload({
    client: new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: `${process.env.AWS_REGION_DEV}`,
    }),
    params: {
      ACL: "public-read",
      Bucket: `${process.env.AWS_BUCKET_NAME_DEV}`,
      Key: `categories/${category}/${categoryId}.png`,
      Body: fileStream,
      ContentType: "image/png",
    },
  })
    .done()
    .then((data) => {
      console.log("DATA", data.Location);
    })
    .catch((err) => {
      console.log(err);
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
      AWSuploadCategoriesToS3(photo[0].path, category._id, category.name);
      category.photo.name = category._id + ".png";
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
      console.log("PHOTO", photo);
      AWSuploadCategoriesToS3(photo[0].path, category._id, category.name);
      category.photo.name = category._id + ".png";
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
