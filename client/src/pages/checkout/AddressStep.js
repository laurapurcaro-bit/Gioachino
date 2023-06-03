import React, { useState } from "react";
import styling from "./AddressStep.module.css";
import axios from "axios";

const AddressStep = ({ address, onNext, onAddressChange }) => {
  const { street, city, zip, state } = address;
  const [validationError, setValidationError] = useState(false);
  const [streetRequired, setStreetRequired] = useState(false);
  const [cityRequired, setCityRequired] = useState(false);
  const [zipRequired, setZipRequired] = useState(false);
  const [stateRequired, setStateRequired] = useState(false);

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
    const updatedAddress = { ...address, state: event.target.value };
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
    } else if (!state) {
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
          addressLines: [street, city, state, zip],
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
          onNext();
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

  return (
    <div className={styling.container}>
      <h2>Step 1: Add your address</h2>
      <form>
        <label>Street</label>
        <input
          type="text"
          value={street}
          onChange={handleStreet}
          className={styling.input}
          placeholder="Enter your address"
          required
        />
        {streetRequired && <p className={styling.error}>Street is required</p>}
        <label>City</label>
        <input
          type="text"
          value={city}
          onChange={handleCity}
          className={styling.input}
          placeholder="Enter city"
          required
        />
        {cityRequired && <p className={styling.error}>City is required</p>}
        <label>Zip</label>
        <input
          type="number"
          value={zip}
          onChange={handleZip}
          className={styling.input}
          placeholder="Enter ZIP"
          required
        />
        {zipRequired && <p className={styling.error}>ZIP is required</p>}
        <label>State</label>
        <input
          type="text"
          value={state}
          onChange={handleState}
          className={styling.input}
          placeholder="Enter state"
          required
        />
        {stateRequired && <p className={styling.error}>State is required</p>}
        {validationError && <p className={styling.error}>Invalid address</p>}
        <button
          type="button"
          onClick={validateAddress}
          className={styling.button}
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default AddressStep;
