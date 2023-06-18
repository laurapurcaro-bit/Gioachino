import { useEffect } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

// Custom component to wrap the PayPalButtons and handle currency changes
const ButtonWrapper = ({ currency, showSpinner }) => {
  // This values are the props in the UI
  const amount = "2.12";
  const style = { layout: "horizontal", tagline: false};
  // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
  // This is the main reason to wrap the PayPalButtons in a new component
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency, showSpinner]);

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[amount, currency, style]}
        fundingSource={undefined}
        createOrder={(data, actions) => {
          return actions.order
            .create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: amount,
                  },
                },
              ],
            })
            .then((orderId) => {
              // Your code here after create the order
              return orderId;
            });
        }}
        onApprove={function (data, actions) {
          return actions.order.capture().then(function (details) {
            // Your code here after capture the order
            const name = details.payer.name.given_name;
            return name;
          });
        }}
        onError={function (err) {
          // Show an error page here, when an error occurs
          console.log(err);
        }}
      />
    </>
  );
};

export default function PaypalButton() {
  const paypalOptions = {
    clientId: `${process.env.REACT_APP_PAYPAL_CLIENT_ID}`,
    currency: "EUR",
    intent: "capture",
  };
  return (
    <div>
      <PayPalScriptProvider options={paypalOptions}>
        <ButtonWrapper currency={"EUR"} showSpinner={false} />
      </PayPalScriptProvider>
    </div>
  );
}
