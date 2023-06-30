import styling from "./CheckoutPageOld.module.css";
import { useEffect, useState } from "react";
import ShippingForm from "./ShippingForm";
import ContactInformation from "./ContactInformation";
import BillingForm from "./BillingForm";
import PaymentCustom from "../../components/payment/PaymentCustom";
import { Trans, useTranslation } from "react-i18next";
import {
  EditOutlined,
  CheckCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { OrderSumm } from "./OrderSumm";
import PaypalButton from "./PaypalButton";
import { decryptData, encryptData } from "../../constants";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";

function DisplayFirstStep({
  formData,
  setFormData,
  handleChange,
  handleNextStep,
  checked,
  handleSaveInfo,
  message,
  setMessage,
}) {
  // context
  const [auth, setAuth] = useAuth();

  const isFormDataComplete = () => {
    const {
      name,
      surname,
      shipping: { street, city, zip, phone, province, country },
      billing: {
        street: billingStreet,
        city: billingCity,
        zip: billingZip,
        province: billingProvince,
      },
      email,
      paymentMethod,
      billingAddressSameAsShippingAddress,
    } = formData;

    // Check if any required field is empty
    if (
      name === "" ||
      surname === "" ||
      street === "" ||
      city === "" ||
      zip === "" ||
      phone === "" ||
      province === "" ||
      country === "" ||
      email === "" ||
      paymentMethod === ""
    ) {
      console.log("FormData is not complete");
      setMessage("Please fill in all the required fields");
      return false; // FormData is not complete
    }

    // Check billing address if it's not the same as shipping address
    if (
      !billingAddressSameAsShippingAddress &&
      (billingStreet === "" ||
        billingCity === "" ||
        billingZip === "" ||
        billingProvince === "")
    ) {
      console.log("Billing address is not complete");
      setMessage("Please fill in all the required fields");
      return false; // Billing address is not complete
    }
    console.log("FormData is complete");
    return true; // FormData is complete
  };

  const saveUserInfo = async () => {
    // Save the new address to the user's addresses array
    const updatedUser = { ...auth.user };
    if (!updatedUser.shippingAddresses) {
      updatedUser.shippingAddresses = [];
    }
    const shippingAddresses = formData?.shipping;
    // Save the new billing address to the user's billingAddresses array
    let billingAddresses;
    if (!formData.billingAddressSameAsShippingAddress) {
      billingAddresses = formData?.billing;
    } else {
      billingAddresses = formData?.shipping;
    }
    // TODO: Send updatedUser to backend API to save the changes
    try {
      const { data } = await axios.post("/profile/addresses/checkout", {
        form: formData,
        newShippingAddress: shippingAddresses,
        newBillingAddress: billingAddresses,
        provider: auth?.user?.provider || "email",
      });
      // Handle error
      if (data?.error) {
        toast.error(data.error);
        return;
      } else {
        console.log("USER", data);
        // Update context
        setAuth({ ...auth, user: data });
        // local storage
        let localData = JSON.parse(localStorage.getItem("auth"));
        // Update only user in local storage
        localData.user = data;
        // Save to local storage
        localStorage.setItem("auth", JSON.stringify(localData));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onNextStep = () => {
    const isComplete = isFormDataComplete();
    // Save user info if the checkbox is checked
    if (checked) {
      if (isComplete) {
        saveUserInfo();
        handleNextStep();
      }
    } else {
      handleNextStep();
    }
  };

  return (
    <>
      <div className={styling.containerExpressCheckout}>
        <div className={styling.expressCheckoutDiv}>
          <div className={styling.expressCheckoutHeader}>Express checkout</div>
          <div className={styling.paypalButtonContainer}>
            {/* <PaypalButton /> */}
          </div>
        </div>
      </div>
      <div className={styling.lineContainer}>
        <div className={styling.line}></div>
        <div className={styling.textLine}>or continue with</div>
      </div>
      <div className={`${styling.formDiv} ${styling.leftBorder}`}>
        <div className={styling.title}>
          <h1>1.</h1>
          <h3>
            <strong>Contact information</strong>
          </h3>
        </div>
        <ContactInformation
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
        />
      </div>
      <div className={`${styling.formDiv} ${styling.leftBorder}`}>
        <div className={styling.title}>
          <h1>2.</h1>
          <h3>
            <strong>Shipping address</strong>
          </h3>
        </div>
        <ShippingForm formData={formData} handleChange={handleChange} />
      </div>
      {formData.billingAddressSameAsShippingAddress ? null : (
        <div className={`${styling.formDiv} ${styling.leftBorder}`}>
          <div className={styling.title}>
            <h1>3.</h1>
            <h3>
              <strong>Billing address</strong>
            </h3>
          </div>
          <BillingForm
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
          />
        </div>
      )}
      <div className={styling.checkboxDiv}>
        <input
          className={styling.checkboxInput}
          type="checkbox"
          name="checked"
          checked={checked}
          onChange={(e) => handleSaveInfo(e)}
        />
        <label className={styling.checkboxLabel}>
          Save information for next time
        </label>
      </div>
      {message ? <p style={{ color: "red" }}>{message}</p> : null}
      <div className={styling.marginTop}>
        <p>
          To proceed with your purchase, accept the Terms & Conditions and
          Privacy Policy
        </p>
        <hr />
        <div className={styling.colElements}>
          <span>Back to cart</span>
          <button onClick={onNextStep} className={styling.nextButton}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}

function DisplayPaymentStep({
  formData,
  setFormData,
  handlePreviousStep,
  instance,
  setInstance,
  message,
  handleBuy,
  loading,
}) {
  // context
  const [auth] = useAuth();
  const [hasAlreadyPaid, setHasAlreadyPaid] = useState(false);

  // function
  const handleUpdateContactInformation = () => {
    handlePreviousStep();
  };
  return (
    <>
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
            {formData?.name} {formData?.surname}
          </p>
          <p>
            <strong>Email:</strong> {formData?.email}
          </p>
          <p>
            <strong>Phone:</strong> {formData?.shipping.phone}
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
            {formData?.shipping?.street}, {formData?.shipping?.zip}
          </p>
          <p>
            {formData?.shipping?.city}, {formData?.shipping?.province},{" "}
            {formData?.shipping?.country}
          </p>
        </div>
      </div>
      {formData.billingAddressSameAsShippingAddress ? (
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
              {formData?.shipping?.street}, {formData?.shipping?.zip}
            </p>
            <p>
              {formData?.shipping?.city}, {formData?.shipping?.province},{" "}
              {formData?.shipping?.country}
            </p>
          </div>
        </div>
      ) : (
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
              {formData?.billing?.street}, {formData?.billing?.zip}
            </p>
            <p>
              {formData?.billing?.city}, {formData?.billing?.province},{" "}
              {formData?.billing?.country}
            </p>
          </div>
        </div>
      )}
      <div className={`${styling.formDiv} ${styling.leftBorder}`}>
        <div className={styling.title}>
          <h1>4.</h1>
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
      <div className={styling.marginTop}>
        <p>
          To proceed with your purchase, accept the Terms & Conditions and
          Privacy Policy
        </p>
        <hr />
        <div className={styling.colElements}>
          <button onClick={handlePreviousStep} className={styling.nextButton}>
            Previous
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
    </>
  );
}

function AlreadyPaidStep() {
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState(null);
  const [instance, setInstance] = useState("");
  const [isSaveInfo, setIsSaveInfo] = useState(false);
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
  const [auth, setAuth] = useAuth();
  console.log("auth", auth);

  const cartLs = decryptData("cart");
  // function
  const cartTotal = () => {
    const total = decryptData("cartTotalWithIVA");
    // console.log("TOTAL", total);
    return total;
  };

  const amount = cartTotal();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setMessage(null);
    console.log("name", name);
    if (name.startsWith("shipping.")) {
      const shippingField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        shipping: {
          ...prevData.shipping,
          [shippingField]: fieldValue,
        },
      }));
    } else if (name.startsWith("billing.")) {
      const billingField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        billing: {
          ...prevData.billing,
          [billingField]: fieldValue,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: fieldValue,
      }));
    }

    console.log("formData", formData);
  };

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
  };
  // function
  const handleUpdateContactInformation = () => {
    // handlePreviousStep();
    navigate("/checkout");
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
                    // onClick={handlePreviousStep}
                    className={styling.nextButton}
                  >
                    Previous
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

export { DisplayFirstStep, DisplayPaymentStep, AlreadyPaidStep };
