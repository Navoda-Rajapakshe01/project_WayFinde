// src/components/OptimizedTrip/AddTripNamePopup.jsx

import React from "react";
import "./AddTripNamePopup.css"; // ✅ (Optional styling)

const AddTripNamePopup = ({ tripName, setTripName, onConfirm, onClose }) => {
  return (
    <div className="popup-overlay-2">
      <div className="popup-container-2">
        <button onClick={onClose} className="popup-close-2">
          &times;
        </button>

        <h2 className="popup-title">Add Trip Name</h2>
        <p>Give your trip a unique name to save it.</p>

        <input
          type="text"
          className="popup-input"
          placeholder="Enter a trip name..."
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />

        <button className="popup-confirm-2" onClick={onConfirm}>
          Confirm & Continue
        </button>
      </div>
    </div>
  );
};

export default AddTripNamePopup;
