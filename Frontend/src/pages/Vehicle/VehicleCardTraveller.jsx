import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router

const VehicleCardTraveller = ({ vehicle }) => {
  const navigate = useNavigate(); // Create navigate function using useNavigate hook

  const handleViewNow = () => {
    // Navigate to the VehicleDetailPage with the vehicle's ID
    navigate(`/vehicle/${vehicle.id}`);
  };

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
        <p className="vehicle-price">Rs. {vehicle.pricePerDay}/day</p>
        <p className="vehicle-description">
          {vehicle.type} - seats: {vehicle.numberOfPassengers} -{" "}
          {vehicle.fuelType} - {vehicle.transmissionType}
        </p>
        <div className="vehicle-availability">
          <strong>Status: </strong>
          <span className={vehicle.isAvailable ? "available" : "rented"}>
            {vehicle.isAvailable ? "Available" : "Rented"}
          </span>
        </div>
        {/* Display amenities if available */}
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

        {/* View Now Button */}
        <button
          className="view-now-btn"
          onClick={handleViewNow} // Use handleViewNow to navigate to the vehicle detail page
        >
          View Now
        </button>
      </div>
    </div>
  );
};

export default VehicleCardTraveller;
