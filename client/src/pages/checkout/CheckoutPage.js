import React, { useState } from "react";
import AddressStep from "./AddressStep";
import ShippingMethodStep from "./ShippingMethodStep";
import PaymentMethodStep from "./PaymentMethodStep";
import styling from "./CheckoutPage.module.css";

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    zip: "",
    state: "",
  });
  const [shippingMethod, setShippingMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleAddressChange = (updatedAddress) => {
    setAddress(updatedAddress);
  };

  const handleShippingMethodChange = (value) => {
    setShippingMethod(value);
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
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
            paymentMethod={paymentMethod}
            onPrevious={handlePreviousStep}
            onPaymentMethodChange={handlePaymentMethodChange}
          />
        );
      default:
        return null;
    }
  };

  const renderProgressBar = () => {
    return (
      <div>
        <div
          className={`${styling.step} ${
            currentStep === 1 ? styling.active : ""
          }`}
        >
          Step 1
        </div>
        <div
          className={`${styling.step} ${
            currentStep === 2 ? styling.active : ""
          }`}
        >
          Step 2
        </div>
        <div
          className={`${styling.step} ${
            currentStep === 3 ? styling.active : ""
          }`}
        >
          Step 3
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1>Payment Page</h1>
      {renderProgressBar()}
      {renderStep()}
    </div>
  );
}
