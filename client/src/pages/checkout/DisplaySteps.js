import styling from "./CheckoutPageOld.module.css";
import ShippingForm from "./ShippingForm";
import ContactInformation from "./ContactInformation";
import BillingForm from "./BillingForm";
import PaymentCustom from "../../components/payment/PaymentCustom";
import { Trans, useTranslation } from "react-i18next";
import { EditOutlined, CheckCircleFilled } from "@ant-design/icons";

function DisplaySteps({
  stepN,
  stepTitle,
  formData,
  setFormData,
  handleChange,
  Component,
}) {
  return (
    <div className={`${styling.formDiv} ${styling.leftBorder}`}>
      <div className={styling.title}>
        <h1>{stepN}</h1>
        <h3>
          <strong>{stepTitle}</strong>
        </h3>
      </div>
      <Component
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
      />
    </div>
  );
}

function DisplayFirstStep({
  formData,
  setFormData,
  handleChange,
  handleNextStep,
}) {
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
        <ShippingForm
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
        />
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
    </>
  );
}

function DisplayPaymentStep({
  formData,
  handlePreviousStep,
  instance,
  setInstance,
  message,
}) {
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
      {formData.billingAddressSameAsShippingAddress ? null : (
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
          <h1>{formData.billingAddressSameAsShippingAddress ? "3." : "4."}</h1>
          <h3>
            <strong>Payment method</strong>
          </h3>
        </div>
        <PaymentCustom
          instance={instance}
          setInstance={setInstance}
          message={message}
        />
      </div>
    </>
  );
}

export { DisplaySteps, DisplayFirstStep, DisplayPaymentStep };
