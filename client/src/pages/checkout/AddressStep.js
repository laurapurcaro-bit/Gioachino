import React from "react";
import styling from "./AddressStep.module.css";

const AddressStep = ({ address, onNext, onAddressChange }) => {
  const { street, city, zip, state } = address;

  const handleStreet = (event) => {
    const updatedAddress = { ...address, street: event.target.value };
    onAddressChange(updatedAddress);
  };

  const handleCity = (event) => {
    const updatedAddress = { ...address, city: event.target.value };
    onAddressChange(updatedAddress);
  };

  const handleZip = (event) => {
    const updatedAddress = { ...address, zip: event.target.value };
    onAddressChange(updatedAddress);
  };

  const handleState = (event) => {
    const updatedAddress = { ...address, state: event.target.value };
    onAddressChange(updatedAddress);
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
        />
        <label>City</label>
        <input
          type="text"
          value={city}
          onChange={handleCity}
          className={styling.input}
          placeholder="Enter city"
        />
        <label>Zip</label>
        <input
          type="number"
          value={zip}
          onChange={handleZip}
          className={styling.input}
          placeholder="Enter ZIP"
        />
        <label>State</label>
        <input
          type="text"
          value={state}
          onChange={handleState}
          className={styling.input}
          placeholder="Enter state"
        />
        <button type="button" onClick={onNext} className={styling.button}>
          Next
        </button>
      </form>
    </div>
  );
};

export default AddressStep;
