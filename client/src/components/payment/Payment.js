import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import DropIn from "braintree-web-drop-in-react";

export default function Payment({ singleCart, cartTotal, onPaymentSuccess }) {
  // context
  const [auth] = useAuth();
  // state
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
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
      // access the nonce
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/braintree/payment", {
        nonce,
        cart: singleCart,
        amount: cartTotal(),
        provider: auth.user.provider,
      });
      console.log(data);
      // empty the cart
      onPaymentSuccess();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h4 className="mb-1">Payment</h4>
      {/* <div>{JSON.stringify(clientToken)}</div> */}
      {!clientToken || !singleCart.length ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="mt-1 mb-3">
            <DropIn
              options={{
                authorization: clientToken,
                paypal: {
                  flow: "vault",
                },
              }}
              // we need to send instance to process the payment
              onInstance={(instance) => setInstance(instance)}
            />
          </div>
          <button
            className="btn btn-primary col-md-12"
            onClick={handleBuy}
            disabled={!auth.user.address || !instance}
          >
            Buy
          </button>
        </>
      )}
    </>
  );
}
