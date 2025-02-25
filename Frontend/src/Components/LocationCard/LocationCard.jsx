import React from "react";
import "./LocationCard.css";

const LocationCard = ({ location }) => {
  return (
    <div className="location-card">
      <img src={location.image} alt={location.name} />
      <div className="location-info">
        <h3>{location.name}</h3>
        <p>{location.description}</p>
      </div>
    </div>
  );
};

export default LocationCard;
