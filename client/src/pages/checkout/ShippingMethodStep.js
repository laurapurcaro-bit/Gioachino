import React from "react";
import styling from "./ShippingMethodStep.module.css";

const ShippingMethodStep = ({
  shippingMethod,
  onNext,
  onPrevious,
  onShippingMethodChange,
}) => {
  const handleShippingMethodChange = (e) => {
    onShippingMethodChange(e.target.value);
  };

  return (
    <div className={styling.container}>
      <h2>Step 2: Select shipping method</h2>
      <form>
        <div className={styling.shipping}>
          <label className={styling.label}>
            <input
              type="radio"
              value="standard"
              checked={shippingMethod === "standard"}
              onChange={handleShippingMethodChange}
              className={styling.radio}
            />
            Standard Shipping
          </label>
          <label className={styling.label}>
            <input
              type="radio"
              value="express"
              checked={shippingMethod === "express"}
              onChange={handleShippingMethodChange}
              className={styling.radio}
            />
            Express Shipping
          </label>
        </div>
        <div className={styling.buttons}>
          <button
            type="button"
            onClick={onPrevious}
            className={styling.previousButton}
          >
            Previous
          </button>
          <button type="button" onClick={onNext} className={styling.nextButton}>
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingMethodStep;
