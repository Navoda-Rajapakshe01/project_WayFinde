import React from "react";
import { useNavigate } from "react-router-dom";
//import "../CSS/VehicleTraveller.css"; // Optional: Ensure consistent style separation

const VehicleCardTraveller = ({ vehicle }) => {
  const navigate = useNavigate();

  const handleViewNow = () => {
    navigate(`/vehicle/${vehicle.id}`);
  };

  return (
    <div className="vehicle-card">
      <img
        src={vehicle.imageUrls?.$values?.[0] || "/default.jpg"}
        alt={`${vehicle.brand} ${vehicle.model}`}
        className="vehicle-image"
      />

      <div className="card-body">
        <h3 className="vehicle-name">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="vehicle-location">{vehicle.location}</p>
        <p className="vehicle-price">Rs. {vehicle.pricePerDay}/day</p>
        <p className="vehicle-description">
          {vehicle.type} - Seats: {vehicle.numberOfPassengers} -{" "}
          {vehicle.fuelType} - {vehicle.transmissionType}
        </p>

        {/* Status */}
        <div className="vehicle-availability">
          <strong>Status:</strong>{" "}
          <span className={vehicle.isAvailable ? "available" : "rented"}>
            {vehicle.isAvailable ? "Available" : "Rented"}
          </span>
        </div>

        {/* Amenities */}
        {vehicle.amenities?.length > 0 && (
          <div className="vehicle-amenities">
            <p>
              <strong>Amenities:</strong>
            </p>
            <div className="amenity-tags">
              {vehicle.amenities.map((amenity, index) => (
                <span key={index} className="amenity-tag">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* View Button */}
        <button className="view-now-btn" onClick={handleViewNow}>
          View Now
        </button>
      </div>
    </div>
  );
};

export default VehicleCardTraveller;
