// src/components/OptimizedTrip/TripDestinationCard.jsx

import React from "react";
import "./TripDestinationCard.css"; //

const TripDestinationCard = ({ place, index, startDate }) => {
  return (
    <div className="destination-card">
      <div className="destination-number">{index}</div>

      <img
        src={place.mainImageUrl || "https://via.placeholder.com/150"} //
        alt={place.name}
        className="destination-image"
      />

      <div className="destination-details">
        <h3>{place.name}</h3>
        {startDate && (
          <p>
            <strong>Trip Start:</strong>{" "}
            {new Date(startDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default TripDestinationCard;
