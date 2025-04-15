import React from "react";
import { FaBed, FaUsers, FaBath, FaHome, FaMapMarkerAlt } from "react-icons/fa"; // Added FaMapMarkerAlt for location
import "./AccommodationDealCard.css";

const AccommodationDealCard = ({ accommodation }) => {
  const handleViewNow = () => {
    navigate("/Accommodationdeal/", { state: { AccommodationDealCard } });
  };

  return (
    <div className="accommodation-deal-card">
      <img
        src={accommodation.image}
        alt={accommodation.name}
        className="accommodation-image"
      />
      <div className="accommodation-details">
        <h3 className="accommodation-name">{accommodation.name}</h3>
        <p className="accommodation-price">
          ${accommodation.price} <span>/ night</span>
        </p>
        {/* Display Location */}
        <div className="accommodation-location">
          <FaMapMarkerAlt className="location-icon" />
          <span>{accommodation.location}</span>
        </div>
        <div className="accommodation-features">
          <div className="feature">
            <FaHome className="feature-icon" />
            <span>{accommodation.type}</span>
          </div>
          <div className="feature">
            <FaUsers className="feature-icon" />
            <span>{accommodation.guests} Guests</span>
          </div>
          <div className="feature">
            <FaBed className="feature-icon" />
            <span>{accommodation.bedrooms} Bedrooms</span>
          </div>
          <div className="feature">
            <FaBed className="feature-icon" />
            <span>{accommodation.beds} Beds</span>
          </div>
          <div className="feature">
            <FaBath className="feature-icon" />
            <span>{accommodation.baths} Baths</span>
          </div>
        </div>
        <button className="book-button" onClick={handleViewNow}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default AccommodationDealCard;
