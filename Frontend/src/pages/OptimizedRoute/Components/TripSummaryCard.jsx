import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Navigation } from "lucide-react";
import "./TripSummaryCard.css";

const TripSummaryCard = ({ title, value, icon }) => {
  const renderIcon = () => {
    switch (icon) {
      case "calendar":
        return <Calendar size={24} />;
      case "map-pin":
        return <MapPin size={24} />;
      case "navigation":
        return <Navigation size={24} />;
      default:
        return null;
    }
  };

  return (
    <div className="trip-summary-card">
      <div className="card-icon">{renderIcon()}</div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{value}</p>
      </div>
    </div>
  );
};

export default TripSummaryCard;
