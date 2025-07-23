import React, { useState, useEffect } from "react";
import { X, ArrowLeft, Edit3 } from "lucide-react";

const TripNameModal = ({ onSubmit, isSubmitting, error, onBack, onClose }) => {
  const [tripName, setTripName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tripName.trim()) {
      onSubmit(tripName.trim());
    }
  };

  return (
    <div className="modal-overlay startlocation">
      <div className="modal-container">
        <div className="modal-header-tnm">
          <button className="modal-back" onClick={onBack}>
            <ArrowLeft size={18} />
          </button>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <h2 className="modal-title">Add Trip Name</h2>
        <p className="modal-subtitle">Give your trip a name to get started.</p>

<form onSubmit={handleSubmit}>
  <div className="modal-content">
    {/* Trip Name Input Styled Like Location Selector */}
    <div className="location-selector">
      <div className="select-container flex items-center gap-2 border border-gray-300 rounded px-3 py-2 w-full bg-white">
        <Edit3 className="text-gray-500" size={20} />
        <input
          type="text"
          className="flex-1 outline-none bg-transparent border-none"
          placeholder="Enter a trip name..."
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          required
          minLength={3}
          maxLength={50}
        />
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  </div>

  <div className="modal-footer">
    <button
      type="submit"
      className="modal-button"
      disabled={isSubmitting || !tripName.trim()}
    >
      {isSubmitting ? "Creating Trip..." : "Confirm & Continue"}
    </button>
  </div>
</form>


      </div>
    </div>
  );
};

export default TripNameModal;
