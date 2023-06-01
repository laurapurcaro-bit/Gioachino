import React from "react";
import styling from "./Popup.module.css";

const Popup = ({ onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <div className={`${styling.popup}`} onClick={handleClose}>
      <div className={styling.popupContent}>
        {/* X button */}
        <span className={styling.close}>&times;</span>
        <h2>Sign in to newsletter</h2>
      </div>
    </div>
  );
};

export default Popup;
