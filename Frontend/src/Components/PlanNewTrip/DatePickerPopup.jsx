// DatePickerPopup.jsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Popup.css"; // CSS for DatePickerPopup

const DatePickerPopup = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setShowPopup,
  navigate,
}) => {
  const handleDatesContinue = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates!"); // Show error if any date is missing
    } else {
      navigate("/trip-planner"); // Proceed to trip planner after selecting dates
    }
  };

  return (
    <div className="popup-overlay-1">
      <div className="popup-container-1">
        <button
          onClick={() => setShowPopup("location")} // Go back to location popup
          className="popup-back-1"
        >
          ←
        </button>
        <button onClick={() => setShowPopup(null)} className="popup-close-1">
          &times;
        </button>

        <h2 className="popup-title">Select Your Travel Dates</h2>
        <p>
          Choose the date range for your trip to plan your itinerary
          efficiently.
        </p>

        <div className="date-picker-container">
          <div className="date-picker">
            <label>Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)} // Update start date
              dateFormat="dd / MM / yyyy"
              className="popup-select"
              placeholderText="Select Start Date"
            />
          </div>
          <div className="date-picker">
            <label>End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)} // Update end date
              dateFormat="dd / MM / yyyy"
              className="popup-select"
              placeholderText="Select End Date"
            />
          </div>
        </div>

        <button
          className="popup-confirm-1"
          onClick={handleDatesContinue} // Proceed to trip planner only if dates are selected
        >
          Confirm & Continue
        </button>
      </div>
    </div>
  );
};

export default DatePickerPopup;
