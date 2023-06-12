import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import DropIn from "braintree-web-drop-in-react";
import { Trans } from "react-i18next";

export default function Payment({ cart, cartTotal, onPaymentSuccess, selectedAddress, shippingMethod }) {
  // context
  const [auth] = useAuth();
  // state
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  // loading state to disable the pay button
  const [loading, setLoading] = useState(false);
  // constant
  const amount = cartTotal();
  // hooks
  useEffect(() => {
    if (auth?.token) {
      getClientToken();
    }
  }, [auth?.token]);

  // functions
  const getClientToken = async () => {
    try {
      const { data } = await axios.get("/braintree/token");
      setClientToken(data.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuy = async () => {
    try {
      setLoading(true);
      // access the nonce
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/braintree/payment", {
        nonce,
        cart: cart,
        selectedAddress: selectedAddress,
        shippingMethod: shippingMethod,
        amount: amount,
        provider: auth.user.provider,
      });
      setLoading(false);
      // empty the cart and send email and redirect to dashboard
      onPaymentSuccess(data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      {/* <div>{JSON.stringify(clientToken)}</div> */}
      {!clientToken || !cart?.length ? (
        <div><Trans>Loading</Trans>...</div>
      ) : (
        <>
          <div className="mt-1 mb-3">
            <DropIn
              options={{
                authorization: clientToken,
                paypal: {
                  flow: "vault",
                },
                googlePay: {
                  merchantId: process.env.REACT_APP_BRAINTREE_MERCHANT_ID,
                  transactionInfo: {
                    totalPriceStatus: "FINAL",
                    totalPrice: amount,
                    currencyCode: "EUR",
                  },
                },
                applePay: {
                  displayName: "Ecommerce",
                  paymentRequest: {
                    total: {
                      label: "Ecommerce",
                      amount: amount,
                      type: "final",
                    },
                    countryCode: "IT",
                    currencyCode: "EUR",
                    supportedNetworks: ["visa", "masterCard"],
                    merchantCapabilities: [
                      "supports3DS",
                      "supportsCredit",
                      "supportsDebit",
                    ],
                  },
                },
              }}
              // we need to send instance to process the payment
              onInstance={(instance) => setInstance(instance)}
            />
          </div>
          <button
            className="btn btn-primary col-md-12"
            onClick={handleBuy}
            disabled={!selectedAddress || !instance || loading}
          >
            {loading ? <p><Trans>Loading</Trans>...</p> : <p><Trans>Pay</Trans></p>}
          </button>
        </>
      )}
    </div>
  );
}
