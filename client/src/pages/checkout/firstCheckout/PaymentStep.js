import styling from "./CheckoutPageOld.module.css";
import { useState } from "react";
import PaymentCustom from "../../components/payment/PaymentCustom";
import { Trans } from "react-i18next";
import {
  EditOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useAuth } from "../../context/auth";

export default function DisplayPaymentStep({
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
  
  