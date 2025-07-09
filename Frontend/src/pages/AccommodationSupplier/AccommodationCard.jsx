import React from "react";
import "../CSS/Accommodation.css";

const AccommodationCard = ({
  accommodation,
  onToggleStatus,
  onEdit,
  onDelete,
  onViewBookings,
}) => {
  return (
    <div className="accommodation-card">
      <img
        src={
          accommodation.imageUrls?.[0] || "/images/default-accommodation.jpg"
        }
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

        <p className="accommodation-status">
          Status:{" "}
          <span
            className={`status-${
              accommodation.status
                ? accommodation.status.toLowerCase()
                : "available"
            }`}>
            {accommodation.status || "Available"}
          </span>
        </p>

        <div className="accommodation-card-actions">
          <button
            className={`status-toggle-btn ${
              accommodation.status === "Available" ? "available" : "unavailable"
            }`}
            onClick={() =>
              onToggleStatus(
                accommodation.id,
                accommodation.status || "Available"
              )
            }>
            {accommodation.status === "Available" || !accommodation.status
              ? "Mark as Unavailable"
              : "Mark as Available"}
          </button>

          {/* Add additional buttons for supplier actions */}
          <div className="action-buttons">
            <button
              className="view-bookings-btn"
              onClick={() =>
                onViewBookings && onViewBookings(accommodation.id)
              }>
              View Bookings
            </button>

            <button
              className="edit-btn"
              onClick={() => onEdit && onEdit(accommodation)}>
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => onDelete && onDelete(accommodation.id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;
