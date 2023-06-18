import { provincesInItaly } from "../../constants";
import React, { useState } from "react";
import styling from "./BillingForm.module.css";
import Select from "react-select";

const ShippingForm = ({ formData, handleChange, setFormData }) => {
  const [filteredProvinces, setFilteredProvinces] = useState([]);

  const handleChangeProvince = (selectedOption) => {
    handleChange({
      target: {
        name: "shipping.province",
        value: selectedOption ? selectedOption.value : "",
      },
    });
  };

  const formatProvinces = (provinces) => {
    return provinces.map((province) => ({
      value: province,
      label: province,
    }));
  };

  const filterProvinces = (inputValue) => {
    return provincesInItaly.filter((province) =>
      province.toLowerCase().startsWith(inputValue.toLowerCase())
    );
  };

  return (
    <form className={styling.billingFormContainer}>
      {/* Make name and surname in one row */}
      <div className={styling.inputs}>
        <div className={styling.twoRowsInput}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className={styling.twoRowsInput}>
          <label>Surname:</label>
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            value={formData.surname}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className={styling.oneRowInput}>
        <label>Address:</label>
        <input
          type="text"
          name="shipping.street"
          placeholder="Address"
          value={formData.shipping.street}
          onChange={handleChange}
        />
      </div>
      {/* Make city and state in one row */}
      <div className={styling.inputs}>
        <div className={styling.twoRowsInput}>
          <label>Country:</label>
          <input
            type="text"
            name="shipping.country"
            placeholder="Country"
            value="Italy"
            disabled
          />
        </div>
        <div className={styling.twoRowsInput}>
          <label>ZIP:</label>
          <input
            type="text"
            name="shipping.zip"
            placeholder="ZIP"
            value={formData.shipping.zip}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className={styling.inputs}>
        <div className={styling.twoRowsInput}>
          <label>City:</label>
          <input
            type="text"
            name="shipping.city"
            placeholder="City"
            value={formData.shipping.city}
            onChange={handleChange}
          />
        </div>
        <div className={`${styling.twoRowsInput}`}>
          <label>Province:</label>
          <Select
            name="shipping.province"
            placeholder="Type to filter provinces"
            value={
              formData.shipping.province
                ? {
                    value: formData.shipping.province,
                    label: formData.shipping.province,
                  }
                : null
            }
            onChange={handleChangeProvince}
            onInputChange={(inputValue) =>
              setFilteredProvinces(filterProvinces(inputValue))
            }
            options={formatProvinces(filteredProvinces)}
            isClearable
          />
        </div>
      </div>
      <div className={styling.oneRowInput}>
        <label>Phone:</label>
        <input
          type="text"
          name="shipping.phone"
          placeholder="Phone"
          value={formData.shipping.phone}
          onChange={handleChange}
        />
      </div>
      <div className={styling.checkboxDiv}>
        <input
          className={styling.checkboxInput}
          type="checkbox"
          value={formData.billingAddressSameAsShippingAddress}
          name="billingAddressSameAsShippingAddress"
          checked={formData.billingAddressSameAsShippingAddress}
          onChange={handleChange}
        />
        <label className={styling.checkboxLabel}>
          Billing address is same as shipping address
        </label>
      </div>
    </form>
  );
};

export default ShippingForm;
