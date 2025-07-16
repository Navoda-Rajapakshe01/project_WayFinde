import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './VehicleRent.css'; // Import the CSS file

const VehicleRent = () => {
  // State for managing selected dates
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [savedVehicles, setSavedVehicles] = useState([]);

  // Sample vehicles data
  const vehicles = [
    {
      id: 1,
      name: "Bajaj RE Three Wheeler",
      mainImageUrl: "/path-to-your-bajaj-re.jpg",
      seats: 3,
      bags: 2,
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: "Honda",
      mainImageUrl: "/path-to-your-honda.jpg",
      seats: 4,
      bags: 2,
      rating: 4.8,
      reviews: 124
    }
  ];

  // Toggle save function
  const toggleSave = (vehicleId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedVehicles(prev => 
      prev.includes(vehicleId) 
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  return (
    <div className="vehicle-rent-container">
      
      {/* Vehicles List Section */}
      <div className="vehicle-cards-container">
        {vehicles.map((vehicle, index) => (
          <div key={index} className="vehicle-card">
            {/* Main Image */}
            <div
              className="vehicle-image"
              style={{ backgroundImage: `url(${vehicle.mainImageUrl})` }}
            >
              {/* Save Button */}
              <button
                className={`save-button ${savedVehicles.includes(vehicle.id) ? 'save-button-active' : ''}`}
                onClick={(e) => toggleSave(vehicle.id, e)}
                aria-label="Save this vehicle"
              >
                <span>+</span> Add
              </button>
            </div>
            <div className="vehicle-info">
              <div className="vehicle-details">
                <span>{vehicle.seats} Seats</span>
                <span>{vehicle.bags} Bags</span>
              </div>
              <div className="vehicle-rating">
                <span>⭐ {vehicle.rating} ({vehicle.reviews} reviews)</span>
              </div>
              <button className="book-now-button">Book Now</button>
              <span className="availability-status available">Available</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleRent;
