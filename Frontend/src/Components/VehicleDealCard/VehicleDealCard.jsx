import React from "react";
import { FaCar, FaUsers, FaGasPump, FaCogs } from "react-icons/fa"; // Icons for features
import "./VehicleDealCard.css";

function VehicleDealCard({ vehicle }) {
  return (
    <div className="vehicle-deal-card">
      <img src={vehicle.image} alt={vehicle.name} className="vehicle-image" />
      <div className="vehicle-details">
        <h3 className="vehicle-name">{vehicle.name}</h3>
        <p className="vehicle-price">
          ${vehicle.price} <span>/ day</span>
        </p>
        <div className="vehicle-features">
          <div className="feature">
            <FaCar className="feature-icon" />
            <span>{vehicle.type}</span>
          </div>
          <div className="feature">
            <FaUsers className="feature-icon" />
            <span>{vehicle.passengers} Passengers</span>
          </div>
          <div className="feature">
            <FaGasPump className="feature-icon" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="feature">
            <FaCogs className="feature-icon" />
            <span>{vehicle.transmission}</span>
          </div>
        </div>
        <button className="rent-button">Rent Now</button>
      </div>
    </div>
  );
}

export default VehicleDealCard;
