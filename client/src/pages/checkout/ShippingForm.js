import { provincesInItaly } from "../../constants";
import React, { useState } from "react";
import styling from "./ShippingForm.module.css";
import Select from "react-select";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";

const ShippingForm = ({ formData, handleChange }) => {
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [auth, setAuth] = useAuth();

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

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const updatedUser = { ...auth.user };
    if (!updatedUser.shippingAddresses) {
      updatedUser.shippingAddresses = [];
    }
    updatedUser.shippingAddresses.push(formData?.shipping);
    console.log("UPDATED USER", updatedUser);
    // TODO: Send updatedUser to backend API to save the changes
    try {
      const { data } = await axios.put("/profile/addresses/add", {
        addresses: updatedUser.shippingAddresses,
        provider: auth.user.provider || "email",
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
      }
    } catch (err) {
      console.log(err);
    }
    // // Reset the new address state and hide the add address form
    setShowNewAddressForm(false);
  };

  const handleAddressChange = (selectedAddress) => {
    setSelectedAddresses([selectedAddress]); // Select only the clicked address
    // Update the parent component with the selected addresses
    console.log("selectedAddress", selectedAddress);
  };

  const handleShowShippingForm = () => {
    setShowNewAddressForm(!showNewAddressForm);
  };

  const handleRemoveAddress = async (index, addressId) => {
    // Remove the address from the user's addresses array
    const updatedUser = { ...auth.user };
    updatedUser.shippingAddresses.splice(index, 1);
    console.log("addressId", addressId);
    // TODO: Send updatedUser to backend API to save the changes
    try {
      const { data } = await axios.delete("/profile/addresses/delete", {
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
          {auth?.user?.shippingAddresses?.map((address, index) => (
            <div className="col-md-5">
              <div key={index} className={`${styling.radioDiv}`}>
                <input
                  className={styling.radioInput}
                  type="radio"
                  checked={selectedAddresses[0] === address}
                  onChange={() => handleAddressChange(address)}
                />
                <div className={styling.radioLabel}>
                  <p>
                    {auth?.user?.shippingAddresses[index]?.street},{" "}
                    {auth?.user?.shippingAddresses[index]?.zip}
                  </p>
                  <p>
                    {auth?.user?.shippingAddresses[index]?.city},{" "}
                    {auth?.user?.shippingAddresses[index]?.country}
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
      {showNewAddressForm && (
        <>
          <h3>Add new shipping address</h3>
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
                  name="shipping.name"
                  placeholder="Name"
                  value={formData.shipping.name}
                  onChange={handleChange}
                />
              </div>
              <div className={styling.twoRowsInput}>
                <label>Surname:</label>
                <input
                  type="text"
                  name="shipping.surname"
                  placeholder="Surname"
                  value={formData.shipping.surname}
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
            <button className={styling.button} type="submit">
              Save
            </button>
          </form>
        </>
      )}
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
    </>
  );
};

export default ShippingForm;
