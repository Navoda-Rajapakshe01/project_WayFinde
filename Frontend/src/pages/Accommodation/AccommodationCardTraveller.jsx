import React from "react";
//import "../CSS/AccommodationCard.css";

const AccommodationCardTraveller = ({ accommodation, onBookNow }) => {
  return (
    <div className="accommodation-card">
      <img
        src={accommodation.imagePaths?.[0] || "/default-accommodation.jpg"}
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
          ${accommodation.pricePerNight}
          <span>/night</span>
        </p>

        <div className="accommodation-details">
          <div className="accommodation-detail">
            <i className="bi bi-door-closed"></i> {accommodation.bedrooms}{" "}
            {accommodation.bedrooms === 1 ? "bedroom" : "bedrooms"}
          </div>
          <div className="accommodation-detail">
            <i className="bi bi-droplet"></i> {accommodation.bathrooms}{" "}
            {accommodation.bathrooms === 1 ? "bathroom" : "bathrooms"}
          </div>
          <div className="accommodation-detail">
            <i className="bi bi-people"></i> {accommodation.maxGuests}{" "}
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

        <button
          className="book-now-btn"
          onClick={() => onBookNow && onBookNow(accommodation)}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default AccommodationCardTraveller;
