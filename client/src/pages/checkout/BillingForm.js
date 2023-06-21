import { provincesInItaly } from "../../constants";
import React, { useState } from "react";
import styling from "./BillingForm.module.css";
import Select from "react-select";

const BillingForm = ({ formData, handleChange, setFormData }) => {
  const [filteredProvinces, setFilteredProvinces] = useState([]);

  const handleChangeProvince = (selectedOption) => {
    handleChange({
      target: {
        name: "billing.province",
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
      <div className={styling.twoRowsInput}>
        <label>Name:</label>
        <input
          type="text"
          name="billing.name"
          placeholder="Name"
          value={formData.billing.name}
          onChange={handleChange}
        />
      </div>
      <div className={styling.twoRowsInput}>
        <label>Surname:</label>
        <input
          type="text"
          name="billing.surname"
          placeholder="Surname"
          value={formData.billing.surname}
          onChange={handleChange}
        />
      </div>
      <div className={styling.oneRowInput}>
        <label>Address:</label>
        <input
          type="text"
          name="billing.street"
          placeholder="Address"
          value={formData.billing.street}
          onChange={handleChange}
        />
      </div>
      {/* Make city and state in one row */}
      <div className={styling.inputs}>
        <div className={styling.twoRowsInput}>
          <label>Country:</label>
          <input
            type="text"
            name="billing.country"
            placeholder="Country"
            value="Italy"
            disabled
          />
        </div>
        <div className={styling.twoRowsInput}>
          <label>ZIP:</label>
          <input
            type="text"
            name="billing.zip"
            placeholder="ZIP"
            value={formData.billing.zip}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className={styling.inputs}>
        <div className={styling.twoRowsInput}>
          <label>City:</label>
          <input
            type="text"
            name="billing.city"
            placeholder="City"
            value={formData.billing.city}
            onChange={handleChange}
          />
        </div>
        <div className={`${styling.twoRowsInput}`}>
          <label>Province:</label>
          <Select
            name="billing.province"
            placeholder="Type to filter provinces"
            value={
              formData.billing.province
                ? {
                    value: formData.billing.province,
                    label: formData.billing.province,
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
    </form>
  );
};

export default BillingForm;
