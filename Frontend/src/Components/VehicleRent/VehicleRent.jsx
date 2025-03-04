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
      <div className="filter-section">
        <div className="location-input">
          <label>Location</label>
          <input type="text" placeholder="Pick-up location" />
        </div>
        <div className="date-input">
          <label>Pick-up Date</label>
          <DatePicker
            selected={pickupDate}
            onChange={(date) => setPickupDate(date)}
            dateFormat="MM/dd/yyyy"
            placeholderText="mm / dd / yyyy"
            className="date-picker-input"
          />
        </div>
        <div className="date-input">
          <label>Return Date</label>
          <DatePicker
            selected={returnDate}
            onChange={(date) => setReturnDate(date)}
            dateFormat="MM/dd/yyyy"
            placeholderText="mm / dd / yyyy"
            className="date-picker-input"
          />
        </div>
    
      </div>

      <div className="vehicles-list">
        {/* Toyota RAV4 */}
        <div className="vehicle-card">
          <img src="/path-to-your-toyota-rav4.jpg" alt="Toyota RAV4" />
          <div className="vehicle-info">
            <h3>Toyota RAV4</h3>
            <div className="vehicle-details">
              <span>5 Seats</span>
              <span>3 Bags</span>
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
            <h3>Honda</h3>
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

        {/* Honda NAVI 110 */}
        <div className="vehicle-card">
          <img src="/path-to-your-honda-navi.jpg" alt="Honda NAVI 110" />
          <div className="vehicle-info">
            <h3>Honda NAVI 110</h3>
            <div className="vehicle-details">
              <span>2 Seats</span>
              <span>1 Bags</span>
            </div>
            <div className="vehicle-rating">
              <span>⭐ 4.8 (124 reviews)</span>
            </div>
            <button className="book-now-button unavailable-button">Unavailable</button>
            <span className="availability-status unavailable">Unavailable</span>
          </div>
        </div>

        {/* Bajaj RE Three Wheeler */}
        <div className="vehicle-card">
          <img src="/path-to-your-bajaj-re.jpg" alt="Bajaj RE Three Wheeler" />
          <div className="vehicle-info">
            <h3>Bajaj RE Three Wheeler</h3>
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
      </div>
    </div>
  );
};

export default VehicleRent;
