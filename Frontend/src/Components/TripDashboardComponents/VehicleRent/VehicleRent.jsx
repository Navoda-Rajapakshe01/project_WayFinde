import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './VehicleRent.css'; // Import the CSS file

const VehicleRent = () => {
  // State for managing selected dates
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

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
            <button className="book-now-button">Book Now</button>
            <span className="availability-status available">Available</span>
          </div>
        </div>

        {/* Bajaj RE Three Wheeler */}
        <div className="vehicle-card">
          <img src="/path-to-your-bajaj-re.jpg" alt="Bajaj RE Three Wheeler" />
          <div className="vehicle-info">
            
            <div className="vehicle-details">
              <span>3 Seats</span>
              <span>2 Bags</span>
            </div>
            <div className="vehicle-rating">
              <span>⭐ 4.8 (124 reviews)</span>
            </div>
            <button className="book-now-button">Book Now</button>
            <span className="availability-status available">Available</span>
          </div>
        </div>

          {/* Honda */}
          <div className="vehicle-card">
          <img src="/path-to-your-honda.jpg" alt="Honda" />
          <div className="vehicle-info">
           
            <div className="vehicle-details">
              <span>4 Seats</span>
              <span>2 Bags</span>
            </div>
            <div className="vehicle-rating">
              <span>⭐ 4.8 (124 reviews)</span>
            </div>
            <button className="book-now-button">Book Now</button>
            <span className="availability-status available">Available</span>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default VehicleRent;
