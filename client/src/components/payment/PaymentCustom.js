import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import DropIn from "braintree-web-drop-in-react";
import { Trans, useTranslation } from "react-i18next";
import styling from "./Payment.module.css";

export default function PaymentCustom({ setInstance, message }) {
  // context
  const [auth] = useAuth();
  const { t } = useTranslation();
  const paymentLanguagePlaceholder = t("paymentLanguagePlaceholder");
  // state
  const [clientToken, setClientToken] = useState("");
  // constant
  //   const amount = cartTotal();
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

  return (
    <div className="mt-3">
      {/* <div>{JSON.stringify(clientToken)}</div> */}
      {!clientToken ? (
        <div>
          <Trans>Loading</Trans>...
        </div>
      ) : (
        <>
          <div className="mt-1 mb-3">
            <DropIn
              options={{
                authorization: clientToken,
                // language
                locale: paymentLanguagePlaceholder,
                card: {
                  cardholderName: {
                    required: true,
                  },
                  overrides: {
                    styles: {
                      input: {
                        color: "green",
                        "font-size": "1rem",
                        "background-color": "white",
                      },
                      ".invalid": {
                        color: "red",
                      },
                    },
                  },
                },
                paypal: {
                  flow: "vault",
                  buttonStyle: {
                    color: "blue",
                    shape: "rect",
                    size: "medium",
                  },
                },
                googlePay: {
                  merchantId: process.env.REACT_APP_BRAINTREE_MERCHANT_ID,
                  transactionInfo: {
                    totalPriceStatus: "FINAL",
                    totalPrice: 1,
                    currencyCode: "EUR",
                  },
                },
                applePay: {
                  displayName: "Ecommerce",
                  paymentRequest: {
                    total: {
                      label: "Ecommerce",
                      amount: 1,
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
              onInstance={(newInstance) => setInstance(newInstance)}
            />
            {message && <div className="text-danger" style={{fontSize: "1.5rem"}}>{message}</div>}
          </div>
        </>
      )}
    </div>
  );
}
