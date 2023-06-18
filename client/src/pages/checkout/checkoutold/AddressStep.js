import React, { useState } from "react";
import styling from "./AddressStep.module.css";
import axios from "axios";
import { Trans, useTranslation } from "react-i18next";
import { useAuth } from "../../../context/auth";
import { toast } from "react-hot-toast";

const AddressStep = ({ address, onNext, onAddressChange }) => {
  const { street, city, zip, country } = address;
  const [validationError, setValidationError] = useState(false);
  const [streetRequired, setStreetRequired] = useState(false);
  const [cityRequired, setCityRequired] = useState(false);
  const [zipRequired, setZipRequired] = useState(false);
  const [stateRequired, setStateRequired] = useState(false);
  const [auth, setAuth] = useAuth();
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  // Translate
  const { t } = useTranslation();

  const handleStreet = (event) => {
    const updatedAddress = { ...address, street: event.target.value };
    onAddressChange(updatedAddress);
    setStreetRequired(false);
  };

  const handleCity = (event) => {
    const updatedAddress = { ...address, city: event.target.value };
    onAddressChange(updatedAddress);
    setCityRequired(false);
  };

  const handleZip = (event) => {
    const updatedAddress = { ...address, zip: event.target.value };
    onAddressChange(updatedAddress);
    setZipRequired(false);
  };

  const handleState = (event) => {
    const updatedAddress = { ...address, country: event.target.value };
    onAddressChange(updatedAddress);
    setStateRequired(false);
  };

  const validateAddress = () => {
    if (!street) {
      setStreetRequired(true);
      return;
    } else if (!city) {
      setCityRequired(true);
      return;
    } else if (!zip) {
      setZipRequired(true);
      return;
    } else if (!country) {
      setStateRequired(true);
      return;
    }
    const apiKey = process.env.REACT_APP_MAPS_KEY;
    const url = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`;

    axios
      .post(url, {
        address: {
          regionCode: "IT",
          languageCode: "it",
          addressLines: [street, city, country, zip],
        },
      })
      .then((response) => {
        const { addressComplete } = response.data.result.verdict;
        if (addressComplete === true) {
          const { addressComponents } = response.data.result.address;
          for (const element of addressComponents) {
            console.log(element.confirmationLevel);
            if (element.confirmationLevel !== "CONFIRMED") {
              // Address is invalid
              setValidationError(true);
              return;
            }
          }
          // Address is valid
          setValidationError(false);
          handleSaveAddress();
        } else {
          // Address is invalid
          setValidationError(true);
        }
      })
      .catch((error) => {
        console.log(error);
        // Handle error
      });
  };

  const handleSaveAddress = async () => {
    console.log("validateAddress", validationError);
    // Save the new address to the user's addresses array
    const updatedUser = { ...auth.user };
    if (!updatedUser.addresses) {
      updatedUser.addresses = [];
    }
    updatedUser.addresses.push(address);
    console.log("UPDATED USER", updatedUser);
    // TODO: Send updatedUser to backend API to save the changes
    try {
      const { data } = await axios.put("/profile/addresses/add", {
        addresses: updatedUser.addresses,
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
      }
    } catch (err) {
      console.log(err);
    }
    // // Reset the new address state and hide the add address form
    onAddressChange({
      street: "",
      zip: "",
      city: "",
      country: "",
    });
    setShowAddAddress(false);
    setValidationError(false);
  };

  const handleAddAddress = () => {
    setShowAddAddress(true);
  };

  const handleNext = () => {
    if (!auth?.user?.addresses || auth?.user?.addresses?.length === 0) {
      toast.error("Add at least one address");
      return;
    }
    if (!selectedAddresses[0]) {
      toast.error("Select an address");
      return;
    }
    onNext();
  };

  const handleAddressChange = (selectedAddress) => {
    setSelectedAddresses([selectedAddress]); // Select only the clicked address
    onAddressChange(selectedAddress); // Update the parent component with the selected addresses
  };

  return (
    <div className={styling.container}>
      <h2>
        <Trans>Step 1: Add your address</Trans>
      </h2>
      <div className="p-3 mt-2 mb-2 h4 bg-light">
        <Trans>Addresses</Trans>
      </div>
      {auth?.user?.addresses && auth?.user?.addresses?.length > 0 && (
        // Render the existing addresses
        <div className={`row`}>
          {auth?.user?.addresses?.map((address, index) => (
            <div key={index} className="col-md-4">
              <div className={`${styling.cardAddresses}`}>
                <div>
                  <input
                    type="radio"
                    checked={selectedAddresses[0] === address}
                    onChange={() => handleAddressChange(address)}
                  />
                  <p>{address.street}</p>
                  <p>{address.zip}</p>
                  <p>{address.city}</p>
                  <p>{address.country}</p>
                  {/* <button
                      onClick={() => handleRemoveAddress(index, address._id)}
                    >
                      Remove
                    </button> */}
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
      {/* // Render the add address form */}
      {showAddAddress && (
        <form>
          <label>
            <Trans>Street</Trans>
          </label>
          <input
            type="text"
            value={street}
            onChange={handleStreet}
            className={styling.input}
            placeholder={t("streetPlaceholder")}
            required
            autoComplete="street-address"
          />
          {streetRequired && (
            <p className={styling.error}>
              <Trans>Street is required</Trans>
            </p>
          )}
          <label>
            <Trans>City</Trans>
          </label>
          <input
            type="text"
            value={city}
            onChange={handleCity}
            className={styling.input}
            placeholder={t("cityPlaceholder")}
            required
            autoComplete="address-level2"
          />
          {cityRequired && (
            <p className={styling.error}>
              <Trans>City is required</Trans>
            </p>
          )}
          <label>
            <Trans>Zip</Trans>
          </label>
          <input
            type="number"
            value={zip}
            onChange={handleZip}
            className={styling.input}
            placeholder={t("zipPlaceholder")}
            required
            autoComplete="postal-code"
          />
          {zipRequired && (
            <p className={styling.error}>
              <Trans>ZIP is required</Trans>
            </p>
          )}
          <label>
            <Trans>Country</Trans>
          </label>
          <input
            type="text"
            value={country}
            onChange={handleState}
            className={styling.input}
            placeholder={t("countryPlaceholder")}
            required
            autoComplete="country"
          />
          {stateRequired && (
            <p className={styling.error}>
              <Trans>State is required</Trans>
            </p>
          )}
          {validationError && (
            <p className={styling.error}>
              <Trans>Invalid address</Trans>
            </p>
          )}
          <div className={`${styling.buttonsContainer}`}>
            <button
              type="button"
              onClick={validateAddress}
              className={`${styling.button} ${styling.saveButton}`}
            >
              <Trans>Save</Trans>
            </button>
          </div>
        </form>
      )}
      <div className={`${styling.nextContainer}`}>
        <button
          onClick={handleNext}
          className={`${styling.button} ${styling.nextButton}`}
        >
          <Trans>Next</Trans>
        </button>
      </div>
    </div>
  );
};

export default AddressStep;
