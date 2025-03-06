import React from "react";
import { FaMapMarkerAlt, FaCar, FaUser } from "react-icons/fa"; // Import icons from React Icons
import "./SearchVehicle.css";

function SearchVehicle() {
  return (
    <>
      <div className="search-vehicle">
        <div className="search-vehicle-header">
          <h1>Find Your Perfect Vehicle</h1>
          <p>Choose from a variety of vehicles to suit your needs</p>
        </div>
        <div className="search-vehicle-form-container">
          <form className="search-vehicle-form">
            {/* Pickup Location Input with Icon */}
            <div className="input-with-icon">
              <FaMapMarkerAlt className="input-icon" />
              <input type="text" placeholder="Pick up Location Here..." />
            </div>

            {/* Pickup Date Input */}
            <input type="datetime-local" name="pickup-date" id="pickup-date" />

            {/* Dropoff Date Input */}
            <input
              type="datetime-local"
              name="dropoff-date"
              id="dropoff-date"
            />

            {/* Vehicle Type Dropdown with Icon */}
            <div className="select-with-icon">
              <FaCar className="input-icon" />
              <select name="vehicle-type" id="vehicle-type">
                <option value="all">All Vehicles</option>
                <option value="car">Cars</option>
                <option value="van">Van</option>
                <option value="bike">Bikes</option>
                <option value="tuk-tuk">Tuk Tuk</option>
              </select>
            </div>

            {/* Passenger Dropdown with Icon */}
            <div className="select-with-icon">
              <FaUser className="input-icon" />
              <select name="no-passenger" id="no-passenger">
                <option value="all">Select Passengers</option>
                <option value="1">1 Passenger</option>
                <option value="2">2 Passengers</option>
                <option value="3">3 Passengers</option>
                <option value="4">4 Passengers</option>
                <option value="5">5 Passengers</option>
                <option value="6">6+ Passengers</option>
              </select>
            </div>

            {/* Search Button */}
            <button>Search</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SearchVehicle;
