import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './VehicleRent.css'; // Import the CSS file

const VehicleRent = () => {
  const [vehicles, setVehicles] = useState([]); // State for vehicle data
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [savedVehicles, setSavedVehicles] = useState([]); // To manage saved vehicles

  // Fetch vehicle details when the component mounts
  useEffect(() => {
    // API URL to fetch vehicle data
    fetch('http://localhost:5030/api/TravelBudget') // Use your updated API URL
      .then((response) => response.json()) // Convert the response into JSON
      .then((data) => {
        setVehicles(data); // Set the fetched vehicle data into state
      })
      .catch((error) => console.error('Error fetching vehicle data:', error));
  }, []);

  // Function to toggle saving vehicles
  const toggleSave = (vehicleId, e) => {
    e.stopPropagation();
    if (savedVehicles.includes(vehicleId)) {
      setSavedVehicles(savedVehicles.filter((id) => id !== vehicleId));
    } else {
      setSavedVehicles([...savedVehicles, vehicleId]);
    }
  };

  // Show loading state while the data is being fetched
  if (vehicles.length === 0) {
    return <div>Loading...</div>; // Show loading text if no data is loaded yet
  }

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

            {/* Vehicle Information */}
            <div className="vehicle-info">
              <h3 className="vehicle-name">{vehicle.name}</h3>
              <p className="vehicle-reviews">{vehicle.reviews} reviews</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleRent;
