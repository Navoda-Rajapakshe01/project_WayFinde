import React, { useState } from "react";
import ContactPopup from "../ContactPopup/ContactPopup"; // Import the popup component
import "./NameTag.css";

const NameTag = ({ name, rating, price }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleContactNow = () => {
    setIsPopupOpen(true); // Open the popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  return (
    <div className="name-tag">
      <div className="name-tag-left">
        <h1 className="vehicle-name">{name}</h1>
        <div className="rating">
          <span>⭐ {rating}</span>
        </div>
        <p className="price">
          ${price} <span>/ day</span>
        </p>
      </div>
      <div className="name-tag-right">
        <button className="contact-button" onClick={handleContactNow}>
          Contact Now
        </button>
      </div>

      {/* Render the popup if isPopupOpen is true */}
      {isPopupOpen && <ContactPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default NameTag;
