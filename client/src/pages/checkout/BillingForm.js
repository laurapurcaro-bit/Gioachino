import { provincesInItaly } from "../../constants";
import React, { useState } from "react";
import styling from "./BillingForm.module.css";
import Select from "react-select";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";

const BillingForm = ({ formData, setFormData }) => {
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [auth, setAuth] = useAuth();

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

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const updatedUser = { ...auth?.user };
    if (!updatedUser?.billingAddresses) {
      updatedUser.billingAddresses = [];
    }
    updatedUser?.billingAddresses.push(formData?.billing);
    console.log("UPDATED USER", updatedUser);
    // TODO: Send updatedUser to backend API to save the changes
    try {
      const { data } = await axios.put("/profile/billing-addresses/add", {
        addresses: updatedUser?.billingAddresses,
        provider: auth?.user?.provider || "email",
      });
      // Handle error
      if (data?.error) {
        toast.error(data.error);
        return;
      } else {
        // Update context
        setAuth({ ...auth, user: data });
        // local storage
        let localData = JSON.parse(localStorage.getItem("auth"));
        // Update only user in local storage
        localData.user = data;
        console.log("localData", localData.user);
        // Save to local storage
        localStorage.setItem("auth", JSON.stringify(localData));

        setFormData({});
      }
    } catch (err) {
      console.log(err);
    }
    // // Reset the new address state and hide the add address form
    setShowNewAddressForm(false);
  };

  const handleChange = (e) => {
    try {
      console.log("EEE", e.target.value);
      const { name, value } = e.target;
      const billingField = name.split(".")[1];
      setFormData((prevData) => ({
        billing: {
          ...prevData.billing,
          [billingField]: value,
        },
      }));
    } catch {
      console.log("EEE", e.value);
      setFormData((prevData) => ({
        billing: {
          ...prevData.billing,
          province: e.value,
        },
      }));
    }
  };

  const handleAddressChange = (selectedAddress) => {
    setSelectedAddresses([selectedAddress]); // Select only the clicked address
    // Update the parent component with the selected addresses
    console.log("selectedAddress", selectedAddress);
    setFormData((prevData) => ({
      ...prevData,
      billing: {
        ...prevData.billing,
        selectedAddress,
      },
    }));
  };

  const handleShowShippingForm = () => {
    setShowNewAddressForm(!showNewAddressForm);
  };

  const handleRemoveAddress = async (index, addressId) => {
    // Remove the address from the user's addresses array
    const updatedUser = { ...auth.user };
    updatedUser.billingAddresses.splice(index, 1);
    console.log("addressId", addressId);
    // TODO: Send updatedUser to backend API to save the changes
    try {
      const { data } = await axios.delete("/profile/billing-addresses/delete", {
        data: { addressId },
        provider: auth.user.provider || "email",
      });
      // Update the auth context with the modified user data
      setAuth({ ...auth, user: data });
      // local storage
      let localData = JSON.parse(localStorage.getItem("auth"));
      // Update only user in local storage
      localData.user = data;
      // Save to local storage
      localStorage.setItem("auth", JSON.stringify(localData));
      // Handle the response
      console.log("Address deleted:", data);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <>
      <div className={styling.addresses}>
        <div className={`row`}>
          {auth?.user?.billingAddresses?.map((address, index) => (
            <div key={index} className="col-md-5">
              <div className={`${styling.radioDiv}`}>
                <input
                  className={styling.radioInput}
                  type="radio"
                  checked={selectedAddresses[0] === address}
                  onChange={() => handleAddressChange(address)}
                />
                <div className={styling.radioLabel}>
                  <p>
                    {address?.street}, {address?.zip}
                  </p>
                  <p>
                    {address?.city}, {address?.province}, {address?.country}
                  </p>
                  <div className={styling.closeIcon}>
                    <CloseOutlined
                      style={{ fontSize: "1.5rem" }}
                      onClick={() => handleRemoveAddress(index, address._id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <hr />
      <div className={styling.addAddress}>
        <div
          className={styling.addAddressElements}
          onClick={handleShowShippingForm}
        >
          <PlusOutlined />
          Add address
        </div>
      </div>
      {(showNewAddressForm || auth?.user?.billingAddresses.length < 1) && (
        <>
          <h3>Add new billing address</h3>
          <form
            className={styling.billingFormContainer}
            onSubmit={handleSaveAddress}
          >
            {/* Make name and surname in one row */}
            <div className={styling.inputs}>
              <div className={styling.twoRowsInput}>
                <label>Name:</label>
                <input
                  type="text"
                  name="billing.name"
                  placeholder="Name"
                  value={formData?.billing?.name}
                  onChange={handleChange}
                />
              </div>
              <div className={styling.twoRowsInput}>
                <label>Surname:</label>
                <input
                  type="text"
                  name="billing.surname"
                  placeholder="Surname"
                  value={formData?.billing?.surname}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={styling.oneRowInput}>
              <label>Address:</label>
              <input
                type="text"
                name="billing.street"
                placeholder="Address"
                value={formData?.billing?.street}
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
                  value={formData?.billing?.zip}
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
                  value={formData?.billing?.city}
                  onChange={handleChange}
                />
              </div>
              <div className={`${styling.twoRowsInput}`}>
                <label>Province:</label>
                <Select
                  name="billing.province"
                  placeholder="Type to filter provinces"
                  value={
                    formData?.billing?.province
                      ? {
                          value: formData?.billing?.province,
                          label: formData?.billing?.province,
                        }
                      : null
                  }
                  onChange={handleChange}
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
                name="billing.phone"
                placeholder="Phone"
                value={formData?.billing?.phone}
                onChange={handleChange}
              />
            </div>
            <button className={styling.button} type="submit">
              Save
            </button>
          </form>
        </>
      )}
    </>
  );
};

export default BillingForm;
