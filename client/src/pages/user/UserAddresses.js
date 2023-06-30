import React, { useState } from "react";
import UserMenu from "../../components/nav/UserMenu";
import styling from "./UserAddresses.module.css";
import { Trans, useTranslation } from "react-i18next";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function UserAddresses() {
  const [auth, setAuth] = useAuth();
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    zip: "",
    city: "",
    country: "",
    timestamp: Date.now(),
  });

  const [validationError, setValidationError] = useState(false);

  // Translate
  const { t } = useTranslation();

  const handleAddAddress = () => {
    setShowAddAddress(true);
  };

  const handleInputChange = (e) => {
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveAddress = async () => {
    console.log("validateAddress", validationError);
    // Save the new address to the user's addresses array
    const updatedUser = { ...auth.user };
    if (!updatedUser.shippingAddresses) {
      updatedUser.shippingAddresses = [];
    }
    updatedUser.shippingAddresses.push(newAddress);
    console.log("UPDATED USER", updatedUser);
    // TODO: Send updatedUser to backend API to save the changes
    try {
      const { data } = await axios.put("/profile/addresses/add", {
        addresses: updatedUser.shippingAddresses,
        provider: auth.user.provider || "email",
      });
      // Handle error
      if (data?.error) {
        toast.error(data.error);
        return;
      } else {
        // Update context
        setAuth({ ...auth, user: data });
        // local storage
        let localData = JSON.parse(localStorage.getItem("auth"));
        // Update only user in local storage
        localData.user = data;
        // Save to local storage
        localStorage.setItem("auth", JSON.stringify(localData));
        // success message
        toast.success("Profile updated");
      }
    } catch (err) {
      console.log(err);
    }
    // Reset the new address state and hide the add address form
    setNewAddress({
      street: "",
      zip: "",
      city: "",
      country: "",
    });
    setShowAddAddress(false);
    setValidationError(false);
  };

  const validateAddress = async (e) => {
    e.preventDefault();
    const { street, zip, city, country } = newAddress;
    console.log("newAddress", newAddress);
    const apiKey = process.env.REACT_APP_MAPS_KEY;
    const url = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`;

    const { data } = await axios.post(url, {
      address: {
        regionCode: "IT",
        languageCode: "it",
        addressLines: [street, city, country, zip],
      },
    });

    const { addressComplete } = data.result.verdict;
    if (addressComplete === true) {
      const { addressComponents } = data.result.address;
      for (const element of addressComponents) {
        console.log("ELEMENTS", element.confirmationLevel);
        if (element.confirmationLevel !== "CONFIRMED") {
          // Address is invalid
          setValidationError(true);
          toast.error("Address is invalid");
          return true;
        }
        // Address is valid
        setValidationError(false);
        toast.success("Address is valid");
        // Save the new address
        handleSaveAddress();
        return;
      }
    } else {
      // Address is invalid
      setValidationError(true);
      toast.error("Address is invalid");
    }
  };

  const handleRemoveAddress = async (index, addressId) => {
    // Remove the address from the user's addresses array
    const updatedUser = { ...auth.user };
    updatedUser.shippingAddresses.splice(index, 1);
    console.log("addressId", addressId);
    // TODO: Send updatedUser to backend API to save the changes
    try {
      const { data } = await axios.delete("/profile/addresses/delete", {
        data: { addressId },
        provider: auth.user.provider || "email",
      });
      // Update the auth context with the modified user data
      setAuth({ ...auth, user: data });
      // local storage
      let localData = JSON.parse(localStorage.getItem("auth"));
      // Update only user in local storage
      localData.user = data;
      // Save to local storage
      localStorage.setItem("auth", JSON.stringify(localData));
      // Handle the response
      console.log("Address deleted:", data);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div className={`container-fluid ${styling.containerMain}`}>
      <div className="row">
        <div className="col-md-3">
          <UserMenu />
        </div>
        <div className="col-md-9">
          <div className="p-3 mt-2 mb-2 h4 bg-light">
            <Trans>Addresses</Trans>
          </div>
          {auth?.user?.shippingAddresses && auth?.user?.shippingAddresses?.length > 0 && (
            // Render the existing addresses
            <div className="row">
              {auth?.user?.shippingAddresses?.map((address, index) => (
                <div key={index} className="col-md-4">
                  <div className={`${styling.cardAddresses}`}>
                    <div>
                      <p>{address.street}</p>
                      <p>{address.zip}</p>
                      <p>{address.city}</p>
                      <p>{address.country}</p>
                      <button
                        onClick={() => handleRemoveAddress(index, address._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className={`${styling.lineContainer}`}>
            <hr className={`${styling.line}`} />
          </div>
          {/* // Render the add address button if no addresses exist */}
          <button onClick={handleAddAddress}>
            <Trans>+ Add Address</Trans>
          </button>

          {/* Render the add address form if showAddAddress is true */}
          {showAddAddress && (
            <div>
              <form onSubmit={validateAddress}>
                <input
                  type="text"
                  name="street"
                  value={newAddress.street}
                  onChange={handleInputChange}
                  placeholder={t("streetPlaceholder")}
                />
                <input
                  type="text"
                  name="zip"
                  value={newAddress.zip}
                  onChange={handleInputChange}
                  placeholder={t("ZIP")}
                />
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleInputChange}
                  placeholder={t("City")}
                />
                <input
                  type="text"
                  name="country"
                  value={newAddress.country}
                  onChange={handleInputChange}
                  placeholder={t("Country")}
                />
                <button type="submit">
                  <Trans>Save Address</Trans>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
