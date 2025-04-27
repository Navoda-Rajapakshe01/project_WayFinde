// src/components/OptimizedTrip/TripSummaryBox.jsx

import React from "react";
import "./TripSummaryBox.css"; // ✅ (Optional CSS file, you can create later)

const TripSummaryBox = ({ travelDays, destinationCount, travelDistance }) => {
  return (
    <div className="trip-summary">
      <div className="summary-box">
        <h4>Travel Days</h4>
        <p>{travelDays}</p>
      </div>
      <div className="summary-box">
        <h4>Total Destinations</h4>
        <p>{destinationCount}</p>
      </div>
      <div className="summary-box">
        <h4>Travel Distance</h4>
        <p>{travelDistance} km</p>
      </div>
    </div>
  );
};

export default TripSummaryBox;
