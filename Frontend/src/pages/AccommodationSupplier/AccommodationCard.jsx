import React from "react";
import "../CSS/Accommodation.css";

const AccommodationCard = ({
  accommodation,
  onToggleStatus = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onViewBookings = () => {},
}) => {
  const status = (accommodation.status || "Available").toLowerCase();
  const isAvailable = status === "available";

  return (
    <div className="accommodation-card">
      <img
        src={
          accommodation.imageUrls?.$values?.[0] ||
          "/images/default-accommodation.jpg"
        }
        alt={accommodation.name || "Accommodation"}
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
            <i className="bi bi-door-closed" aria-label="Bedrooms"></i>{" "}
            {accommodation.bedrooms}{" "}
            {accommodation.bedrooms === 1 ? "bedroom" : "bedrooms"}
          </div>
          <div className="accommodation-detail">
            <i className="bi bi-droplet" aria-label="Bathrooms"></i>{" "}
            {accommodation.bathrooms}{" "}
            {accommodation.bathrooms === 1 ? "bathroom" : "bathrooms"}
          </div>
          <div className="accommodation-detail">
            <i className="bi bi-people" aria-label="Guests"></i>{" "}
            {accommodation.maxGuests}{" "}
            {accommodation.maxGuests === 1 ? "guest" : "guests"}
          </div>
        </div>

        {accommodation.amenities?.length > 0 && (
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

        <p className="accommodation-status">
          Status:{" "}
          <span className={`status-${status}`}>
            {accommodation.status || "Available"}
          </span>
        </p>

        <div className="accommodation-card-actions">
          <button
            type="button"
            className={`status-toggle-btn ${
              isAvailable ? "available" : "unavailable"
            }`}
            onClick={() =>
              onToggleStatus(
                accommodation.id,
                accommodation.status || "Available"
              )
            }>
            {isAvailable ? "Mark as Unavailable" : "Mark as Available"}
          </button>

          <div className="action-buttons">
            <button
              type="button"
              className="view-bookings-btn"
              onClick={() => onViewBookings(accommodation.id)}>
              View Bookings
            </button>

            <button
              type="button"
              className="edit-btn"
              onClick={() => onEdit(accommodation)}>
              Edit
            </button>

            <button
              type="button"
              className="delete-btn"
              onClick={() => onDelete(accommodation.id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;
