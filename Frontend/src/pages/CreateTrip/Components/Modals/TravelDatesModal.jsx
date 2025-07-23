import React, { useState } from "react";
import { X, ArrowLeft } from "lucide-react";

const TravelDatesModal = ({ onSelect, onBack, onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (startDate && endDate) {
      onSelect(startDate, endDate);
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    if (endDate && new Date(endDate) < new Date(newStartDate)) {
      setEndDate(newStartDate);
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

        <h2 className="modal-title">Select Your Travel Dates</h2>
        <p className="modal-subtitle">
          Choose the date range for your trip to plan your itinerary efficiently
        </p>

        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="location-selector space-y-4">
              {/* Start Date */}
              <div>
                <label className="date-label">Start Date</label>
                <div className="modal-date-field">
                  <input
                    type="date"
                    className="location-select w-full outline-none bg-white border border-gray-300 rounded px-3 py-2"
                    value={startDate}
                    onChange={handleStartDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="date-label">End Date</label>
                <div className="modal-date-field">
                  <input
                    type="date"
                    className="location-select w-full outline-none bg-white border border-gray-300 rounded px-3 py-2"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="submit"
              className="modal-button"
              disabled={!startDate || !endDate}
            >
              Confirm & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TravelDatesModal;
