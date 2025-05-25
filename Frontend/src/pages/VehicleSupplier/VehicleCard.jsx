import React from "react";
import "../CSS/VehicleSupplier.css";

const VehicleCard = ({
  vehicle,
  onToggleStatus,
  onEdit,
  onDelete,
  onViewBookings,
}) => {
  // Determine status string safely
  const status =
    vehicle.status ?? (vehicle.isAvailable ? "Available" : "Rented");
  console.log(vehicle); // Check the actual structure of the vehicle object
  console.log(vehicle.imageUrls);

  return (
    <div className="vehicle-card">
      <img
        src={vehicle.imageUrls?.[0] || "/default.jpg"}
        alt={`${vehicle.brand} ${vehicle.model}`}
        className="vehicle-image"
      />
      <div className="card-body">
        <h3 className="vehicle-name">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="vehicle-location">{vehicle.location}</p>
        <p className="vehicle-price">Rs{vehicle.pricePerDay}/day</p>
        <p className="vehicle-description">
          {vehicle.type} - seats {vehicle.numberOfPassengers} -{" "}
          {vehicle.transmissionType}
        </p>

        {/* Amenities section */}
        {vehicle.amenities && vehicle.amenities.length > 0 && (
          <div className="vehicle-amenities">
            <p>
              <strong>Amenities:</strong>
            </p>
            <div className="amenity-tags">
              {vehicle.amenities.map((amenity, i) => (
                <span key={i} className="amenity-tag">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="vehicle-status">
          Status:{" "}
          <span className={`status-${status.toLowerCase()}`}>{status}</span>
        </p>

        <div className="vehicle-card-actions">
          <button
            className="status-toggle-btn"
            onClick={() => onToggleStatus(vehicle.id, status)}>
            {status === "Available" ? "Mark as Rented" : "Mark as Available"}
          </button>

          <div className="action-buttons">
            <button
              className="view-bookings-btn"
              onClick={() => onViewBookings && onViewBookings(vehicle.id)}>
              View Bookings
            </button>

            <button
              className="edit-btn"
              onClick={() => onEdit && onEdit(vehicle)}>
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => onDelete && onDelete(vehicle.id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
