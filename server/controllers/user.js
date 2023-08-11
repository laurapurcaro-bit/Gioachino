const User = require("../models/user");
const { UserModelGoogle } = require("../models/userGoogle");
const { hashPassword } = require("../helpers/auth");
const dotenv = require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

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
          shippingAddresses: addresses || user.shippingAddresses,
          billingAddresses: user.billingAddresses,
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
          shippingAddresses: addresses || user.shippingAddresses,
          billingAddresses: user.billingAddresses,
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
        { shippingAddresses: addresses || [] },
        { new: true }
      );

      // Send response
      res.json(user);
    } else {
      const { addresses } = req.body;
      console.log("Address", addresses);
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { shippingAddresses: addresses || [] },
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
        { $pull: { shippingAddresses: { _id: addressId } } },
        { new: true }
      );

      // Send response
      res.json(user);
    } else {
      const { addressId } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { shippingAddresses: { _id: addressId } } },
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
        { _id: req.user._id, "shippingAddresses._id": addressId },
        { $set: { "shippingAddresses.$": updatedAddress } },
        { new: true }
      );

      // Send response
      res.json(user);
    } else {
      const { addressId, updatedAddress } = req.body;
      const user = await User.findOneAndUpdate(
        { _id: req.user._id, "shippingAddresses._id": addressId },
        { $set: { "shippingAddresses.$": updatedAddress } },
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

const addBillingAddress = async (req, res) => {
  try {
    if (req.body.provider === "google") {
      const { addresses } = req.body;
      const user = await UserModelGoogle.findByIdAndUpdate(
        req.user._id,
        { billingAddresses: addresses || [] },
        { new: true }
      );

      // Send response
      res.json(user);
    } else {
      const { addresses } = req.body;
      console.log("addresses", addresses);
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { billingAddresses: addresses || [] },
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

const deleteBillingAddress = async (req, res) => {
  try {
    if (req.body.provider === "google") {
      const { addressId } = req.body;
      const user = await UserModelGoogle.findByIdAndUpdate(
        req.user._id,
        { $pull: { billingAddresses: { _id: addressId } } },
        { new: true }
      );

      // Send response
      res.json(user);
    } else {
      const { addressId } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { billingAddresses: { _id: addressId } } },
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

const updateBillingAddress = async (req, res) => {
  try {
    if (req.body.provider === "google") {
      const { addressId, updatedAddress } = req.body;
      const user = await UserModelGoogle.findOneAndUpdate(
        { _id: req.user._id, "billingAddresses._id": addressId },
        { $set: { "billingAddresses.$": updatedAddress } },
        { new: true }
      );

      // Send response
      res.json(user);
    } else {
      const { addressId, updatedAddress } = req.body;
      const user = await User.findOneAndUpdate(
        { _id: req.user._id, "billingAddresses._id": addressId },
        { $set: { "billingAddresses.$": updatedAddress } },
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
          // generate unique id
          uniqueId: uuidv4(),
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
          // generate unique id
          uniqueId: uuidv4(),
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

const readWhishlistId = async (req, res) => {
  // retrieve the user's whishlists based on uniqueId
  const { whishlistId } = req.params;
  const { userId } = req.body;

  try {
    // Retrieve the user's whishlists
    const user = await User.findById(userId);
    // Find the wishlist with the matching uniqueId
    const wishlist = user?.whishlists?.find((wishlist) => {
      console.log("WISHLIST!!!!", wishlist.uniqueId);
      return wishlist.uniqueId === whishlistId;
    });
    console.log("WISHLIST", wishlist);

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }
    // Send the wishlist as the response
    res.json(wishlist);
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

const getLatestShippingAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);

    if (
      !user ||
      !user.shippingAddresses ||
      user.shippingAddresses.length === 0
    ) {
      res.json({ message: "User or addresses not found" });
      return;
    }
    // Sort the addresses in descending order based on the timestamp
    user.shippingAddresses.sort((a, b) => b.timestamp - a.timestamp);

    const latestAddress = user.shippingAddresses[0];

    res.status(200).json(latestAddress);
  } catch (error) {
    console.error("Error retrieving latest address:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getLatestBillingAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user || !user.billingAddresses || user.billingAddresses.length === 0) {
      res.json({ message: "User or addresses not found" });
      return;
    }
    // Sort the addresses in descending order based on the timestamp
    user.billingAddresses.sort((a, b) => b.timestamp - a.timestamp);

    const latestAddress = user.billingAddresses[0];

    res.status(200).json(latestAddress);
  } catch (error) {
    console.error("Error retrieving latest address:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const saveUserInfoCheckout = async (req, res) => {
  console.log("SAVE USER INFO CHECKOUT", req.body);
  try {
    const { form, newShippingAddress, newBillingAddress } = req.body;
    const userId = req.user._id;
    User.findById(userId)
      .then((user) => {
        if (user) {
          const { shippingAddresses, billingAddresses } = user;

          // Check if the shipping address already exists
          const isShippingAddressDuplicate = shippingAddresses.some(
            (address) =>
              address.street === newShippingAddress.street &&
              address.city === newShippingAddress.city &&
              address.zip === newShippingAddress.zip &&
              address.country === newShippingAddress.country
          );

          // Check if the billing address already exists
          const isBillingAddressDuplicate = billingAddresses.some(
            (address) =>
              address.street === newBillingAddress.street &&
              address.city === newBillingAddress.city &&
              address.zip === newBillingAddress.zip &&
              address.country === newBillingAddress.country
          );

          // Update the User document if the addresses are not duplicates
          if (!isShippingAddressDuplicate) {
            user.shippingAddresses.push(newShippingAddress);
          } else {
            // If the shipping address is a duplicate, update the timestamp
            // Take the shipping address index that already exists
            const shippingAddressIndex = shippingAddresses.findIndex(
              (address) =>
                address.street === newShippingAddress.street &&
                address.city === newShippingAddress.city &&
                address.zip === newShippingAddress.zip &&
                address.country === newShippingAddress.country
            );
            user.shippingAddresses[shippingAddressIndex].timestamp = new Date();
          }

          if (!isBillingAddressDuplicate) {
            user.billingAddresses.push(newBillingAddress);
          } else {
            // If the billing address is a duplicate, update the timestamp
            // Take the billing address index that already exists
            const billingAddressIndex = billingAddresses.findIndex(
              (address) =>
                address.street === newBillingAddress.street &&
                address.city === newBillingAddress.city &&
                address.zip === newBillingAddress.zip &&
                address.country === newBillingAddress.country
            );
            user.billingAddresses[billingAddressIndex].timestamp = new Date();
          }
          // update phone number
          user.phone = form.shipping.phone;

          // Save the updated User document
          return user.save();
        } else {
          throw new Error("User not found.");
        }
      })
      .then((updatedUser) => {
        console.log("Addresses saved successfully.");
        // Send response
        res.json(updatedUser);
      })
      .catch((error) => {
        console.error("Error saving addresses:", error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error("Error saving user info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserEmailandPhone = async (req, res) => {};

module.exports = {
  updateProfile,
  addAddress,
  deleteAddress,
  updateAddress,
  updateWhishlists,
  readWhishlists,
  deleteWhishlist,
  readWhishlistId,
  getLatestShippingAddress,
  getLatestBillingAddress,
  saveUserInfoCheckout,
  addBillingAddress,
  deleteBillingAddress,
  updateBillingAddress,
};
