import styling from "./CheckoutPageOld.module.css";
import { useState } from "react";
import ShippingForm from "./ShippingForm";
import BillingForm from "./BillingForm";
import { useAuth } from "../../context/auth";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../../context/cart";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { encryptData, decryptData } from "../../constants";
import { OrderSumm } from "./OrderSumm";

export function UpdateShippingAddress({
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
    // const isComplete = isFormDataComplete();
    // // Save user info if the checkbox is checked
    // if (checked) {
    //   if (isComplete) {
    //     saveUserInfo();
    //     handleNextStep();
    //   }
    // } else {
    //   handleNextStep();
    // }
    handleNextStep();
  };

  return (
    <>
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

export function EditAddress() {
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState(null);
  const [instance, setInstance] = useState("");
  const [checked, setChecked] = useState(false);
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
      timestamp: Date.now(),
    },
    billing: {
      name: "",
      surname: "",
      street: "",
      city: "",
      zip: "",
      province: "",
      country: country,
      timestamp: Date.now(),
    },
    email: "",
    paymentMethod: "card",
    billingAddressSameAsShippingAddress: true,
  });

  useEffect(() => {
    loadUserAddress();
  }, []);

  const loadUserAddress = async () => {
    const d = decryptData("checkoutFormData");
    console.log("d", d);
  };

  // const
  const currency = "EUR";
  const localString = "en-US";
  // hook
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [auth] = useAuth();

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

  const handleNextStep = () => {
    navigate("/logged/fast-checkout")
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSaveInfo = (e) => {
    const { name, checked } = e.target;
    console.log("checked", checked);
    setChecked(checked);
  };

  return (
    <div className={styling.container}>
      <div className="">
        <h1 style={{ fontSize: "5rem" }}>Checkout</h1>
      </div>
      <hr />
      <div className="row">
        <div className={`col-md-7`}>
          {/* Button */}
          {/* Steps */}
          <div>
            <UpdateShippingAddress
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              handleNextStep={handleNextStep}
              handleSaveInfo={handleSaveInfo}
              checked={checked}
              message={message}
              setMessage={setMessage}
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
          <div className="col-md-7"></div>
        </div>
      </div>
    </div>
  );
}
