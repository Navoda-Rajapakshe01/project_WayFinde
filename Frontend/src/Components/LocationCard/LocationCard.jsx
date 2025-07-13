import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation on card click
import "./LocationCard.css";

const LocationCard = ({ location }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/location/${location.id}`); 
  };

  return (
    <div
      className="location-card"
      onClick={handleCardClick}
      role="button"
      tabIndex="0"
      onKeyPress={(e) => e.key === "Enter" && handleCardClick()}
    >
      <div className="location-card-image-wrapper">
        <img
          src={
            location.image ||
            "https://via.placeholder.com/400x300/cccccc/808080?text=No+Image"
          } 
          alt={location.name}
          className="location-card-image"
        />
      </div>
      <div className="location-card-content">
        <h3 className="location-card-name">{location.name}</h3>
        <p className="location-card-description">{location.description}</p>
      </div>
    </div>
  );
};

export default LocationCard;
