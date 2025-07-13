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
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
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
            <div className="name-input-container">
              <Edit3 className="name-icon" size={18} />
              <input
                type="text"
                className="name-input"
                placeholder="Enter a trip name..."
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                required
                minLength={3}
                maxLength={50}
              />
            </div>

            {error && <div className="error-message">{error}</div>}
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
