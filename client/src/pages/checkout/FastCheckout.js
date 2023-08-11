import styling from "./CheckoutPageOld.module.css";
import { useEffect, useState } from "react";
import PaymentCustom from "../../components/payment/PaymentCustom";
import { Trans } from "react-i18next";
import { EditOutlined, CheckCircleFilled } from "@ant-design/icons";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { OrderSumm } from "./OrderSumm";
import { decryptData, encryptData } from "../../constants";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";

export default function FastCheckout() {
  const [message, setMessage] = useState(null);
  const [instance, setInstance] = useState("");
  // loading state to disable the pay button
  const [loading, setLoading] = useState(false);
  const country = "Italy";
  const [formData, setFormData] = useState({
    shipping: {
      name: "",
      surname: "",
      street: "",
      city: "",
      zip: "",
      phone: "",
      province: "",
      country: country,
      method: "standard",
    },
    billing: {
      name: "",
      surname: "",
      street: "",
      city: "",
      zip: "",
      phone: "",
      province: "",
      country: country,
      method: "standard",
    },
    email: "",
    paymentMethod: "card",
    billingAddressSameAsShippingAddress: true,
  });

  // const
  const currency = "EUR";
  const localString = "en-US";
  // hook
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  console.log("auth", auth);

  const cartLs = decryptData("cart");
  // function
  const cartTotal = () => {
    const total = decryptData("cartTotalWithIVA");
    // console.log("TOTAL", total);
    return total;
  };

  const amount = cartTotal();

  const onPaymentSuccess = async (data) => {
    // empty the cart
    localStorage.removeItem("cart");
    // empty the state
    setCart([]);
    // send email to user
    await axios.post(`/payment-success/send-email`, {
      order: data,
    });
    // localStorage.setItem("order", JSON.stringify(data));
    encryptData(data, "order");
    // redirect to dashboard
    navigate("/order-confirmation");
    toast.success("Payment Successful");
  };

  const handleBuy = async () => {
    try {
      setLoading(true);
      // access the nonce
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/braintree/payment", {
        nonce,
        cart: cartLs,
        selectedAddress: formData.shipping,
        shippingMethod: formData.shipping.method,
        amount: amount,
        provider: auth?.user?.provider,
      });
      setLoading(false);
      // empty the cart and send email and redirect to dashboard
      onPaymentSuccess(data);
    } catch (error) {
      console.log(error);
      setMessage(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getLatestAddress();
  }, [auth]);

  const getLatestAddress = async () => {
    const responseBilling = await axios.get(
      "/profile/billing-addresses/latest"
    );
    const billingData = responseBilling.data;
    if (billingData.message) {
      console.log(billingData.message);
      return;
    }
    const responseShipping = await axios.get(
      "/profile/shipping-addresses/latest"
    );
    const shippingData = responseShipping.data;
    console.log("data", shippingData);
    if (shippingData.message) {
      console.log(shippingData.message);
      return;
    }
    setFormData({
      ...formData,
      billing: {
        ...formData.billing,
        name: billingData.name,
        surname: billingData.surname,
        street: billingData.street,
        city: billingData.city,
        province: billingData?.province,
        country: billingData.country,
        zip: billingData.zip,
      },
      shipping: {
        ...formData.shipping,
        name: shippingData.name,
        surname: shippingData.surname,
        street: shippingData.street,
        city: shippingData.city,
        province: shippingData?.province,
        country: shippingData.country,
        zip: shippingData.zip,
      },
    });
    const form = {
      billing: billingData,
      shipping: shippingData,
      phone: auth?.user?.phone,
      email: auth?.user?.email,
    };
    encryptData(form, "checkoutFormData");
  };
  // function
  const handleUpdateContactInformation = () => {
    // handlePreviousStep();
    navigate("/logged/fast-checkout/edit-address");
  };

  const handleReturnToCart = () => {
    navigate("/cart");
  };

  return (
    <>
      <div className={styling.container}>
        <div className="">
          <h1 style={{ fontSize: "5rem" }}>Checkout</h1>
        </div>
        <hr />
        <div className="row">
          <div className={`col-md-7`}>
            {/* Button */}
            {/* Steps */}
            <div className={`${styling.formDivSelected}`}>
              <div className={styling.title}>
                <h1>1.</h1>
                <h3>
                  <strong>Contact information</strong>
                  <CheckCircleFilled style={{ color: "green" }} />
                </h3>
              </div>
              <div className={`card ${styling.selectedShipping}`}>
                <div className={styling.editIcon}>
                  <EditOutlined onClick={handleUpdateContactInformation} />
                </div>
                {/* get latest user address */}
                <p>
                  <strong>Email:</strong> {auth?.user?.email}
                </p>
                <p>
                  <strong>Phone:</strong> {auth?.user?.phone}
                </p>
              </div>
            </div>
            <div className={`${styling.formDivSelected}`}>
              <div className={styling.title}>
                <h1>2.</h1>
                <h3>
                  <strong>Shipping</strong>
                  <CheckCircleFilled style={{ color: "green" }} />
                </h3>
              </div>
              <div className={`card ${styling.selectedShipping}`}>
                <div className={styling.editIcon}>
                  <EditOutlined onClick={handleUpdateContactInformation} />
                </div>
                <p>
                  {formData?.shipping.name} {formData?.shipping.surname}
                </p>
                <p>
                  {formData?.shipping?.street}, {formData?.shipping?.zip}
                </p>
                <p>
                  {formData?.shipping?.city},{" "}
                  {formData?.billing?.province
                    ? `${formData?.billing?.province},`
                    : null}
                  {formData?.shipping?.country}
                </p>
              </div>
            </div>
            {/* Billing */}
            <div className={`${styling.formDivSelected}`}>
              <div className={styling.title}>
                <h1>3.</h1>
                <h3>
                  <strong>Billing</strong>
                  <CheckCircleFilled style={{ color: "green" }} />
                </h3>
              </div>
              <div className={`card ${styling.selectedShipping}`}>
                <div className={styling.editIcon}>
                  <EditOutlined onClick={handleUpdateContactInformation} />
                </div>
                <p>
                  {formData?.billing.name} {formData?.billing.surname}
                </p>
                <p>
                  {formData?.billing?.street}, {formData?.billing?.zip}
                </p>
                <p>
                  {formData?.billing?.city},{" "}
                  {formData?.billing?.province
                    ? `${formData?.billing?.province},`
                    : null}
                  {formData?.billing?.country}
                </p>
              </div>
            </div>
            <div className={`${styling.formDiv} ${styling.leftBorder}`}>
              <div className={styling.title}>
                <h1>
                  {formData.billingAddressSameAsShippingAddress ? "3." : "4."}
                </h1>
                <h3>
                  <strong>Payment method</strong>
                </h3>
              </div>
              <PaymentCustom
                // instance={instance}
                setInstance={setInstance}
                message={message}
              />
            </div>
          </div>
          {/* Render the steps components */}
          <div className="col-md-5">
            <div className={`${styling.scrollableColumn}`}>
              <OrderSumm />
            </div>
          </div>
          <div className="row">
            <div className="col-md-7">
              <div className={styling.marginTop}>
                <p>
                  To proceed with your purchase, accept the Terms & Conditions
                  and Privacy Policy
                </p>
                <hr />
                <div className={styling.colElements}>
                  <button
                    onClick={handleReturnToCart}
                    className={styling.nextButton}
                  >
                    <Trans>Return to cart</Trans>
                  </button>
                  <button
                    className={styling.payButton}
                    onClick={handleBuy}
                    // hidden
                    disabled={!instance || loading}
                  >
                    {loading ? (
                      <p>
                        <Trans>Loading</Trans>...
                      </p>
                    ) : (
                      <p>
                        <Trans>Pay</Trans>
                      </p>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
