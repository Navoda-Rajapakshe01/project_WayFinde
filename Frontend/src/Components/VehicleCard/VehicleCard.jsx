import React from "react";
import "./VehicleCard.css";

const VehicleCard = ({ title, content, image }) => {
  return (
    <div className="vehicleCard">
      <img src={image} alt={title} />

      <div className="vehicleCard-info">
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default VehicleCard;
