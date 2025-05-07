import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { FaBed, FaUsers, FaBath, FaHome, FaMapMarkerAlt } from "react-icons/fa";
import "./AccommodationDealCard.css";

const AccommodationDealCard = ({ accommodation }) => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleViewNow = () => {
    // ✅ Navigate using accommodation.id
    navigate(`/Accommodation/${accommodation.id}`);
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
            <span>{accommodation.rooms} Bedrooms</span>
          </div>
          <div className="feature">
            <FaBed className="feature-icon" />
            <span>{accommodation.beds} Beds</span>
          </div>
          <div className="feature">
            <FaBath className="feature-icon" />
            <span>{accommodation.bathRooms} Baths</span>
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
