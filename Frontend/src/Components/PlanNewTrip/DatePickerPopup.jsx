// DatePickerPopup.jsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Popup.css";
import { useTrip } from "../../context/TripContext"; // ✅ use context

const DatePickerPopup = ({ setShowPopup, navigate }) => {
  const { startDate, endDate, setStartDate, setEndDate } = useTrip(); // ✅ context only

  const handleDatesContinue = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates!");
    } else {
      navigate("/trip-planner"); // ✅ go to next page
    }
  };

  return (
    <div className="popup-overlay-1">
      <div className="popup-container-1">
        <button
          onClick={() => setShowPopup("location")}
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
              onChange={(date) => setStartDate(date)}
              dateFormat="dd / MM / yyyy"
              className="popup-select"
              placeholderText="Select Start Date"
              minDate={new Date()} // ✅ Cannot select past dates
            />
          </div>
          <div className="date-picker">
            <label>End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd / MM / yyyy"
              className="popup-select"
              placeholderText="Select End Date"
              minDate={startDate || new Date()} // ✅ Must be after or same as start date
            />
          </div>
        </div>

        <button className="popup-confirm-1" onClick={handleDatesContinue}>
          Confirm & Continue
        </button>
      </div>
    </div>
  );
};

export default DatePickerPopup;
