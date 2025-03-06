import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa"; // Import location icon
import "./VehicleDealCard.css";

const VehicleDealCard = ({ vehicle }) => {
  return (
    <div className="vehicle-deal-card">
      <img src={vehicle.image} alt={vehicle.name} className="vehicle-image" />
      <div className="vehicle-details">
        <h3 className="vehicle-name">{vehicle.name}</h3>
        <p className="vehicle-price">
          ${vehicle.price} <span>/ day</span>
        </p>
        {/* Location Section */}
        <div className="vehicle-location">
          <FaMapMarkerAlt className="location-icon" />
          <span>{vehicle.location}</span>
        </div>
        <div className="vehicle-features">
          <div className="feature">
            <span>Type:</span>
            <span>{vehicle.type}</span>
          </div>
          <div className="feature">
            <span>Passengers:</span>
            <span>{vehicle.passengers}</span>
          </div>
          <div className="feature">
            <span>Fuel:</span>
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="feature">
            <span>Transmission:</span>
            <span>{vehicle.transmission}</span>
          </div>
        </div>
        <button className="book-button">Book Now</button>
      </div>
    </div>
  );
};

export default VehicleDealCard;
