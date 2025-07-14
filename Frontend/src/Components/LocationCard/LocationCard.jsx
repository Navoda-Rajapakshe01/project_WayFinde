import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./LocationCard.css";

const LocationCard = ({ location }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/things-to-do/${location.districtSlug}/${location.id}`); 
  };

  return (
    <div
      className="hp-location-card"
      onClick={handleCardClick}
      role="button"
      tabIndex="0"
      onKeyPress={(e) => e.key === "Enter" && handleCardClick()}
    >
      <div className="hp-location-card-image-wrapper">
        <img
          src={
            location.mainImageUrl ||
            "https://via.placeholder.com/400x300/cccccc/808080?text=No+Image"
          } 
          alt={location.name}
          className="hp-location-card-image"
        />
      </div>
      <div className="hp-location-card-content">
        <h3 className="hp-location-card-name">{location.name}</h3>
        <p className="hp-location-card-description">{location.description}</p>
      </div>
    </div>
  );
};

export default LocationCard;
