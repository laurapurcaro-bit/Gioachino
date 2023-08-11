import styling from "./CheckoutPageOld.module.css";
import { useState } from "react";
import ShippingForm from "../ShippingForm";
import ContactInformation from "../ContactInformation";
import BillingForm from "../BillingForm";
import PaymentCustom from "../../../components/payment/PaymentCustom";
import { Trans } from "react-i18next";
import { EditOutlined, CheckCircleFilled } from "@ant-design/icons";
import { useAuth } from "../../../context/auth";
import axios from "axios";
import toast from "react-hot-toast";

function DisplayStepOne({
  formData,
  setFormData,
  handleChange,
  handleNextStep,
}) {
  // context
  const [auth, setAuth] = useAuth();

  const onNextStep = () => {
    handleNextStep();
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

  console.log("formData", formData);
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
            <strong>Phone:</strong> {formData?.shipping?.phone}
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
            <p>{formData?.billing?.name} {formData?.billing?.surname}</p>
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

function DisplayStepTwo({
  formData,
  setFormData,
  handleChange,
  handleChangeProvince,
  handlePreviousStep,
  handleCheckedAddress,
  handleNextStep,
  checked,
  message,
  setMessage,
}) {

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

  const onNextStep = () => {
    // const isComplete = isFormDataComplete();
    // Save user info if the checkbox is checked
    if (checked) {
      // if (isComplete) {
        handleNextStep();
      // }
    } else {
      handleNextStep();
    }
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
        <ShippingForm formData={formData} setFormData={setFormData}/>
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
          />
        </div>
      )}
      <div className={styling.checkboxDiv}>
        <input
          className={styling.checkboxInput}
          type="checkbox"
          name="checked"
          checked={checked}
          onChange={(e) => handleCheckedAddress(e)}
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
          <button onClick={handlePreviousStep} className={styling.nextButton}>
            Previous
          </button>
          <button onClick={onNextStep} className={styling.nextButton}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export { DisplayStepOne, DisplayStepTwo, DisplayPaymentStep };
