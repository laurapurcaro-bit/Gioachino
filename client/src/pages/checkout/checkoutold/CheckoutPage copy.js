import React, { useState } from "react";
import AddressStep from "./AddressStep";
import ShippingMethodStep from "./ShippingMethodStep";
import PaymentMethodStep from "./PaymentMethodStep";
import styling from "./CheckoutPage.module.css";

const steps = ["Address", "Shipping Method", "Payment Method"];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    zip: "",
    country: "",
  });
  const [shippingMethod, setShippingMethod] = useState("");

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleAddressChange = (updatedAddress) => {
    console.log("updatedAddress", updatedAddress);
    setAddress(updatedAddress);
  };

  const handleShippingMethodChange = (value) => {
    setShippingMethod(value);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AddressStep
            address={address}
            onNext={handleNextStep}
            onAddressChange={handleAddressChange}
          />
        );
      case 2:
        return (
          <ShippingMethodStep
            shippingMethod={shippingMethod}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            onShippingMethodChange={handleShippingMethodChange}
          />
        );
      case 3:
        return (
          <PaymentMethodStep
            onPrevious={handlePreviousStep}
            address={address}
            shippingMethod={shippingMethod}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styling.container}>
      <div className={styling.stepBar}>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`${styling.step} ${
              index < currentStep ? styling.active : ""
            }`}
          >
            <span className={styling.stepNumber}>{index + 1}</span>
          </div>
        ))}
      </div>
      {/* Render the steps components */}
      <div className={styling.stepContent}>{renderStep()}</div>
    </div>
  );
}
