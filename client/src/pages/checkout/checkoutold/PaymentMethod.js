import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import styling from "./PaymentMethod.module.css";

export default function PaymentForm({message, setMessage}) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    const response = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        // return_url: `${window.location.origin}/`,
        payment_method_data: {
          billing_details: {
            address: {
              country: "US",
              line1: "1234 Main Street",
              line2: "3456 Appartment #78",
              city: "Seattle",
              state: "WA",
              postal_code: "98101",
            },
          },
        },
      },
      redirect: "if_required",
    });
    console.log("Response", response);
    if (
      response?.error?.type === "card_error" ||
      response?.error?.type === "validation_error"
    ) {
      setMessage(response.error.message);
    } else if (response?.error?.type === "api_connection_error") {
      setMessage("An unexpected error occured.");
    }

    setIsProcessing(false);
  };

  const optionsPayment = {
    fields: {
      billingDetails: {
        name: "auto",
        email: "auto",
        phone: "auto",
        // address: {
        //   country: "never",
        // },
      },
    },
    layout: {
      type: "accordion",
      defaultCollapsed: false,
      radios: true,
      spacedAccordionItems: false,
    },
    buttonTheme: {
      applePay: "black",
    },
    wallets: {
      applePay: "auto",
      googlePay: "auto",
    },
    paymentMethodOrder: ["card", "klarna", "apple_pay", "google_pay"],
    paymentMethodTypes: ["card", "klarna"],
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className={styling.paymentDiv}>
        <PaymentElement id="payment-element" options={optionsPayment} />
      </div>
      {/* Show any error or success messages */}
      {message && (
        <div id="payment-message" style={{ color: "red", fontSize: "1.5rem" }}>
          {message}
        </div>
      )}
      <div>
        <p>
          To proceed with your purchase, accept the Terms & Conditions and
          Privacy Policy
        </p>
        <hr />
        <div className={styling.colElements}>
          <span>Back to cart</span>
          <button disabled={isProcessing || !stripe || !elements} id="submit">
            <span id="button-text">
              {isProcessing ? "Processing ... " : "Place order"}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}
