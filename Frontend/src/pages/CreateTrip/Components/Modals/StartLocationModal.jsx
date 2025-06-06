import React, { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";

const StartLocationModal = ({ places, onSelect, onClose }) => {
  const [selectedLocationId, setSelectedLocationId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedLocationId) {
      onSelect(selectedLocationId);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Choose your Starting location?</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="modal-subtitle">
          Choose your starting point to plan the best route for your trip
        </p>

        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="location-selector">
              <div className="select-container">
                <MapPin className="select-icon" size={20} />
                <select
                  className="location-select"
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  required
                >
                  <option value="">Pick a starting location...</option>
                  {places.map((place) => (
                    <option key={place._id} value={place._id}>
                      {place.placeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="submit"
              className="modal-button"
              disabled={!selectedLocationId}
            >
              Confirm & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartLocationModal;
