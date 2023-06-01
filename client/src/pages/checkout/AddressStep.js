import React from 'react';
import styling from './AddressStep.module.css';

const AddressStep = ({ address, onNext, onAddressChange }) => {
  const handleAddressChange = (e) => {
    onAddressChange(e.target.value);
  };

  return (
    <div className={styling.container}>
      <h2>Step 1: Add your address</h2>
      <input
        type="text"
        value={address}
        onChange={handleAddressChange}
        className={styling.input}
        placeholder="Enter your address"
      />
      <button onClick={onNext} className={styling.button}>
        Next
      </button>
    </div>
  );
};

export default AddressStep;
