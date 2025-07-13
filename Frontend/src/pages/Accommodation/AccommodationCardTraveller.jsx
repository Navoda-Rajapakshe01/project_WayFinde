import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AccommodationCardTraveller = ({ accommodation }) => {
  const navigate = useNavigate(); // Create navigate function

  const handleViewNow = () => {
    // Navigate to accommodation detail page with accommodation ID
    navigate(`/accommodation/${accommodation.id}`);
  };

  return (
    <div className="accommodation-card">
      <img
        src={accommodation.imageUrls?.[0] || "/default-accommodation.jpg"}
        alt={accommodation.name}
        className="accommodation-image"
      />
      <div className="accommodation-card-body">
        <div className="accommodation-card-header">
          <h3 className="accommodation-name">{accommodation.name}</h3>
          <span className="accommodation-type">{accommodation.type}</span>
        </div>

        <p className="accommodation-location">{accommodation.location}</p>
        <p className="accommodation-price">
          Rs {accommodation.pricePerNight}
          <span>/night</span>
        </p>

        <div className="accommodation-details">
          <div className="accommodation-detail">
            🛏 {accommodation.bedrooms}{" "}
            {accommodation.bedrooms === 1 ? "bedroom" : "bedrooms"}
          </div>
          <div className="accommodation-detail">
            🛁 {accommodation.bathrooms}{" "}
            {accommodation.bathrooms === 1 ? "bathroom" : "bathrooms"}
          </div>
          <div className="accommodation-detail">
            👥 {accommodation.maxGuests}{" "}
            {accommodation.maxGuests === 1 ? "guest" : "guests"}
          </div>
        </div>

        {accommodation.amenities && accommodation.amenities.length > 0 && (
          <div className="accommodation-amenities">
            {accommodation.amenities.slice(0, 3).map((amenity, i) => (
              <span key={i} className="amenity-tag">
                {amenity}
              </span>
            ))}
            {accommodation.amenities.length > 3 && (
              <span className="amenity-tag more-tag">
                +{accommodation.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        <p className="accommodation-description">
          {accommodation.description && accommodation.description.length > 100
            ? `${accommodation.description.substring(0, 100)}...`
            : accommodation.description}
        </p>

        <button className="view-now-btn" onClick={handleViewNow}>
          View Now
        </button>
      </div>
    </div>
  );
};

export default AccommodationCardTraveller;
