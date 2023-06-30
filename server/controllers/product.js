const Product = require("../models/product");
const slugify = require("slugify");
const fs = require("fs"); // Specify the directory to store the uploaded images
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client } = require("@aws-sdk/client-s3");

const AWSuploadProductsToS3 = async (filePath, productId, i, categoryName) => {
  const category = categoryName.toLowerCase();
  // Configure the file stream and obtain the upload parameters
  let fileStream = fs.createReadStream(filePath);
  fileStream.on("error", function (err) {
    console.log("File Error", err);
  });
  // Configure AWS credentials and region
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
      Key: `products/${category}/${productId}-${i}.png`,
      Body: fileStream,
      ContentType: "image/png",
    },
  })
    .done()
    .then((data) => {
      console.log(data.Location);
    })
    .catch((err) => {
      console.log(err);
    });
};

const create = async (req, res) => {
  try {
    // // Handle form data
    const {
      name,
      price,
      description,
      category,
      stock,
      shipping,
      color,
      size,
      categoryName,
      shortDesc,
    } = req.body;
    const { photo, additionalPhotos } = req.files;

    // validation
    switch (true) {
      case !name.trim():
        res.json({ error: "Name is required" });
        break;
      case !description.trim():
        res.json({ error: "Description is required" });
        break;
      case !price:
        res.json({ error: "Price is required" });
        break;
      case !category.trim():
        res.json({ error: "Category is required" });
        break;
      case !stock:
        res.json({ error: "Quantity is required" });
        break;
      case !shipping:
        res.json({ error: "Shipping is required" });
        break;
      case !color:
        res.json({ error: "Color is required" });
        break;
      case !size:
        res.json({ error: "Size is required" });
        break;
      // No bigger than 1MB
      case photo && photo[0].size > 1000000:
        res.json({ error: "Photo needs to be less then 1Mb" });
        break;
    }
    // Update product
    const product = new Product({
      ...req.body,
      categorySlug: slugify(categoryName).toLowerCase(),
      slug: slugify(name),
    });

    if (additionalPhotos) {
      // Add photos to S3
      additionalPhotos.map((file, i) => {
        AWSuploadProductsToS3(file.path, product._id, i + 1, categoryName);
      });
      product.additionalPhotos.name = additionalPhotos.map(
        (file) => file.originalname
      );
    }

    if (photo) {
      // Upload the main photo to S3
      AWSuploadProductsToS3(photo[0].path, product._id, 0, categoryName);
      product.photo.name = photo[0].originalname;
    }

    // Save the product to the database
    await product.save();

    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

const update = async (req, res) => {
  try {
    // // Handle form data
    // console.log(req.fields);
    // // Handle image
    // console.log(req.files);
    // Make sure that required fields are sent
    const {
      name,
      price,
      description,
      category,
      stock,
      shipping,
      color,
      size,
      categoryName,
    } = req.body;
    const { photo, additionalPhotos } = req.files;
    // validation
    switch (true) {
      case !name.trim():
        res.json({ error: "Name is required" });
        break;
      case !description.trim():
        res.json({ error: "Description is required" });
        break;
      case !price:
        res.json({ error: "Price is required" });
        break;
      case !category.trim():
        res.json({ error: "Category is required" });
        break;
      case !stock:
        res.json({ error: "Quantity is required" });
        break;
      case !shipping:
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
        ...req.body,
        categorySlug: slugify(categoryName).toLowerCase(),
        slug: slugify(name),
      },
      // new: true: return the updated product
      { new: true }
    );
    // Add photo to product const
    if (additionalPhotos) {
      // Add photos to S3
      additionalPhotos.map((file, i) => {
        AWSuploadProductsToS3(file.path, product._id, i + 1, categoryName);
      });
      product.additionalPhotos.name = additionalPhotos.map(
        (file) => file.originalname
      );
    }

    if (photo) {
      // Upload the main photo to S3
      AWSuploadProductsToS3(photo[0].path, product._id, 0, categoryName);
      product.photo.name = photo[0].originalname;
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
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      "category"
    );
    res.json(product);
  } catch (error) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const remove = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.productId
    ).select("-photo -additionalPhotos");
    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const filteredProducts = async (req, res) => {
  try {
    // Filter products
    const { checkedCategories, radioPrice } = req.body;
    // Query the DB
    let args = {};
    // If there are checked categories
    if (checkedCategories.length > 0) {
      // add the checked categories to the args object
      args.category = checkedCategories; // 21231
    }
    // If there is a price range
    if (radioPrice.length) {
      // take the lower limit of the price range and higher limit of the price range
      args.price = { $gte: radioPrice[0], $lte: radioPrice[1] }; // [0, 1000]
    }
    console.log(args);
    const products = await Product.find(args);
    console.log(products);
    res.json(products);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const productsCount = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount().exec();
    res.json(total);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const listProducts = async (req, res) => {
  try {
    // Get first 3 products
    const perPage = 3;
    const page = req.params.pageNumber ? req.params.pageNumber : 1;
    const products = await Product.find({})
      // don't return photo
      // .select("-photo -additionalPhotos")
      // Skip 6 products per page
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const productSearch = async (req, res) => {
  try {
    const { search } = req.params;
    // find the product based on the search query
    const results = await Product.find({
      $or: [
        // no case sensitive: $options: "i"
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    });
    // return the products
    res.json(results);
  } catch (err) {
    console.log(err);
  }
};

const relatedProducts = async (req, res) => {
  try {
    const { productId, categoryId } = req.params;
    const related = await Product.find({
      _id: { $ne: productId },
      category: categoryId,
    })
      .limit(3)
      .select("-photo -additionalPhotos")
      .populate("category");
    res.json(related);
  } catch (err) {
    console.log(err);
  }
};

const readProducts = async (req, res) => {
  try {
    // Retrieve the product IDs from the request body
    const productIds = req.body.ids;

    // Find products with matching IDs in the database
    const products = await Product.find({ _id: { $in: productIds } });

    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /additionalPhotos
const additionalPhotos = async (req, res) => {
  try {
    // Get product by slug
    const product = await Product.findOne({ slug: req.params.slug }).select(
      "additionalPhotos"
    );

    // If product exists
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    // Retrieve the additionalPhotos from the product
    if (product) {
      // If photo exists
      if (product.additionalPhotos.name) {
        // Set content type
        // res.set("Content-Type", "image/png");
        res.send(product.additionalPhotos);
      }
    }
  } catch (err) {
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
      if (product.photo.name) {
        // Set content type
        // res.set("Content-Type", product.photo.contentType);
        // Send photo data
        return res.send(product.photo.name);
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

module.exports = {
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
};
