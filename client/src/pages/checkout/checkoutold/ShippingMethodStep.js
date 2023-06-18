import React from "react";
import styling from "./ShippingMethodStep.module.css";
import { Trans } from "react-i18next";

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
      <h2><Trans>Step 2: Select shipping method</Trans></h2>
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
            <Trans>Standard Shipping</Trans>
          </label>
          <label className={styling.label}>
            <input
              type="radio"
              value="express"
              checked={shippingMethod === "express"}
              onChange={handleShippingMethodChange}
              className={styling.radio}
            />
            <Trans>Express Shipping</Trans>
          </label>
        </div>
        <div className={styling.buttons}>
          <button
            type="button"
            onClick={onPrevious}
            className={styling.previousButton}
          >
            <Trans>Previous</Trans>
          </button>
          <button type="button" onClick={onNext} className={styling.nextButton}>
            <Trans>Next</Trans>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingMethodStep;
