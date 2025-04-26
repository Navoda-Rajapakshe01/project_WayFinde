// LocationPopup.jsx
import React, { useState } from "react";
import { useTrip } from "../../context/TripContext";

// LocationPopup Component
const LocationPopup = ({ places, setShowPopup, handleSelectPlace }) => {
  const [selectedLocation, setSelectedLocation] = useState(""); // Track selected location

  // Handle location selection
  const handleLocationSelect = (e) => {
    setSelectedLocation(e.target.value); // Update selected location
  };

  const { setStartingLocation } = useTrip(); // ⬅️ Use shared setter

  // Validate and proceed
  const handleLocationContinue = () => {
    if (!selectedLocation) {
      alert("Please select a starting location!"); // Show error if no location selected
    } else {
      setStartingLocation(selectedLocation); // ⬅️ Save starting location for later use
      handleSelectPlace(selectedLocation); // Handle place selection
      setShowPopup("dates"); // Proceed to the dates popup
    }
  };

  return (
    <div className="popup-overlay-1">
      <div className="popup-container-1">
        <button onClick={() => setShowPopup(null)} className="popup-close-1">
          &times;
        </button>
        <h2 className="popup-title">Choose your Starting location</h2>
        <p>Choose your starting point to plan the best route for your trip.</p>
        <select
          className="popup-select"
          value={selectedLocation}
          onChange={handleLocationSelect}
        >
          <option value="">Pick a starting location...</option>
          {places.map((place) => (
            <option key={place.id} value={place.id}>
              {place.name}
            </option>
          ))}
        </select>
        <button
          className="popup-confirm-1"
          onClick={handleLocationContinue} // Proceed only if location is selected
        >
          Confirm & Continue
        </button>
      </div>
    </div>
  );
};

export default LocationPopup;
