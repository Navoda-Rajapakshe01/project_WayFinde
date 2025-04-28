// src/components/VehicleDealCard.jsx
import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./VehicleDealCard.css";

const VehicleDealCard = ({ vehicle }) => {
  const navigate = useNavigate();

  const handleViewNow = () => {
    navigate(`/vehicle/${vehicle.id}`);
  };

  // Use the first image from the images array, or a fallback
  const imageUrl =
    vehicle.images && vehicle.images.length > 0
      ? vehicle.images[0].url
      : "https://via.placeholder.com/300";

  return (
    <div className="vehicle-deal-card">
      <img src={imageUrl} alt={vehicle.name} className="vehicle-image" />
      <div className="vehicle-details">
        <h3 className="vehicle-name">{vehicle.name}</h3>
        <p className="vehicle-price">
          {vehicle.price} <span></span>
        </p>
        <div className="vehicle-location">
          <FaMapMarkerAlt className="location-icon" />
          <span>{vehicle.location || "Unknown"}</span>
        </div>
        <div className="vehicle-features">
          <div className="feature">
            <span>Type:</span>
            <span>{vehicle.type || "N/A"}</span>
          </div>
          <div className="feature">
            <span>Passengers:</span>
            <span>{vehicle.passengers || "N/A"}</span>
          </div>
          <div className="feature">
            <span>Fuel:</span>
            <span>{vehicle.fuelType || "N/A"}</span>
          </div>
          <div className="feature">
            <span>Transmission:</span>
            <span>{vehicle.transmissionType || "N/A"}</span>
          </div>
        </div>
        <button className="book-button" onClick={handleViewNow}>
          View Now
        </button>
      </div>
    </div>
  );
};

export default VehicleDealCard;
