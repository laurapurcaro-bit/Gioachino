const User = require("../models/user");
const { UserModelGoogle } = require("../models/userGoogle");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

// no change password if user login with google
const updateProfile = async (req, res) => {
  try {
    // console.log("PROFILE UPDATE", req.user);
    if (req.body.provider === "google") {
      const { firstName, lastName, addresses } = req.body;
      // console.log("PROFILE! UPDATE", req.body);
      const user = await UserModelGoogle.findById({ _id: req.user._id });

      // update user
      const updated = await UserModelGoogle.findByIdAndUpdate(
        req.user._id,
        {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          addresses: addresses || user.addresses,
        },
        // get updated data
        { new: true }
      );

      // send response
      res.json(updated);
    } else {
      const { firstName, lastName, password, addresses } = req.body;
      // console.log("PROFILE UPDATE", req.body);
      const user = await User.findById({ _id: req.user._id });

      // check password length
      if (password && password.length < 6) {
        return res.json({
          error: "Password must be at least 6 characters long",
        });
      }

      // hash password
      const hashedPassword = password
        ? await hashPassword(password)
        : undefined;

      // update user
      const updated = await User.findByIdAndUpdate(
        req.user._id,
        {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          password: hashedPassword || user.password,
          addresses: addresses || user.addresses,
        },
        // get updated data
        { new: true }
      );

      // remove password from response
      updated.password = undefined;

      // send response
      res.json(updated);
    }
  } catch (err) {
    console.log("PROFILE UPDATE ERROR", err);
  }
};

const addAddress = async (req, res) => {
  try {
    if (req.body.provider === "google") {
      const { addresses } = req.body;
      const user = await UserModelGoogle.findByIdAndUpdate(
        req.user._id,
        { addresses: addresses || [] },
        { new: true }
      );

      // Send response
      res.json(user);
    } else {
      const { addresses } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { addresses: addresses || [] },
        { new: true }
      );

      // Remove password from response
      user.password = undefined;

      // Send response
      res.json(user);
    }
  } catch (err) {
    console.log("PROFILE UPDATE ERROR", err);
  }
};

const deleteAddress = async (req, res) => {
  try {
    if (req.body.provider === "google") {
      const { addressId } = req.body;
      const user = await UserModelGoogle.findByIdAndUpdate(
        req.user._id,
        { $pull: { addresses: { _id: addressId } } },
        { new: true }
      );

      // Send response
      res.json(user);
    } else {
      const { addressId } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { addresses: { _id: addressId } } },
        { new: true }
      );

      // Remove password from response
      user.password = undefined;

      // Send response
      res.json(user);
    }
  } catch (err) {
    console.log("DELETE ADDRESS ERROR", err);
  }
};

const updateAddress = async (req, res) => {
  try {
    if (req.body.provider === "google") {
      const { addressId, updatedAddress } = req.body;
      const user = await UserModelGoogle.findOneAndUpdate(
        { _id: req.user._id, "addresses._id": addressId },
        { $set: { "addresses.$": updatedAddress } },
        { new: true }
      );

      // Send response
      res.json(user);
    } else {
      const { addressId, updatedAddress } = req.body;
      const user = await User.findOneAndUpdate(
        { _id: req.user._id, "addresses._id": addressId },
        { $set: { "addresses.$": updatedAddress } },
        { new: true }
      );

      // Remove password from response
      user.password = undefined;

      // Send response
      res.json(user);
    }
  } catch (err) {
    console.log("UPDATE ADDRESS ERROR", err);
  }
};

const updateWhishlists = async (req, res) => {
  console.log("UPDATE WHISHLISTS", req.body);
  try {
    const { newWhishlists, provider } = req.body;
    console.log("WHISHLISTS", newWhishlists);
    console.log("USER", req.user._id);
    let user;
    if (provider !== "email") {
      user = await UserModelGoogle.findById(req.user?._id);
      const existingWishlist = user.whishlists.find(
        (wishlist) => wishlist.name === newWhishlists.name
      );
      if (existingWishlist) {
        // Update the existing wishlist with new name and savedItems
        existingWishlist.name = newWhishlists.name;
        existingWishlist.savedItems = newWhishlists.savedItems;
      } else {
        // Create a new wishlist
        user.whishlists.push({
          name: newWhishlists.name,
          savedItems: newWhishlists.savedItems,
        });
      }
      // Save the updated user document
      await user.save();
    } else {
      // Find whishlist name
      user = await User.findById(req.user?._id);
      // Check if a wishlist with the same name already exists
      const existingWishlist = user.whishlists.find(
        (wishlist) => wishlist.name === newWhishlists.name
      );
      if (existingWishlist) {
        // Update the existing wishlist with new name and savedItems
        existingWishlist.name = newWhishlists.name;
        existingWishlist.savedItems = newWhishlists.savedItems;
      } else {
        // Create a new wishlist
        user.whishlists.push({
          name: newWhishlists.name,
          savedItems: newWhishlists.savedItems,
        });
      }
      // Save the updated user document
      await user.save();
    }
    // Send response
    res.json(user.whishlists);
  } catch (err) {
    console.log("PROFILE UPDATE ERROR", err);
    res.status(400).send("Error updating whishlists");
  }
};

const readWhishlists = async (req, res) => {
  try {
    // Retrieve the user's whishlists
    const user = await User.findById(req.user?._id);
    // Send the whishlists as the response
    res.json(user.whishlists);
  } catch (err) {
    console.log("READ WHISHLISTS ERROR", err);
    res.status(400).send("Error reading whishlists");
  }
};

const deleteWhishlist = async (req, res) => {
  const { wishlistId } = req.params;

  try {
    // Find the user and remove the specified wishlist
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { whishlists: { _id: wishlistId } } },
      { new: true }
    );

    // Send the updated whishlists as the response
    res.json(user.whishlists);
  } catch (err) {
    console.log("DELETE WHISHLIST ERROR", err);
    res.status(400).send("Error deleting whishlist");
  }
};

module.exports = {
  updateProfile,
  addAddress,
  deleteAddress,
  updateAddress,
  updateWhishlists,
  readWhishlists,
  deleteWhishlist,
};
