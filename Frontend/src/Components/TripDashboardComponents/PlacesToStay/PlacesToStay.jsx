import React, { useEffect, useState } from 'react';
import './PlacesToStay.css';

function PlacesToStay() {
  const [places, setPlaces] = useState(null); // To hold the travel places data
  const [savedPlaces, setSavedPlaces] = useState([]); // To store the saved places

  // Fetch places details when the component mounts
  useEffect(() => {
    // API URL to fetch places
    fetch('http://localhost:5030/api/TravelBudget') // Use your updated API URL
      .then((response) => response.json()) // Convert the response into JSON
      .then((data) => {
        setPlaces(data); // Set the fetched places data into state
      })
      .catch((error) => console.error('Error fetching travel places:', error));
  }, []);

  // Show loading state while the data is being fetched
  if (!places) {
    return <div>Loading...</div>; // Show loading text if no data is loaded yet
  }

  // Function to toggle the save state
  const toggleSave = (placeId, e) => {
    e.stopPropagation(); // Prevent event bubbling
    
    setSavedPlaces((prevSavedPlaces) => {
      if (prevSavedPlaces.includes(placeId)) {
        return prevSavedPlaces.filter((id) => id !== placeId); // Remove from saved places
      } else {
        return [...prevSavedPlaces, placeId]; // Add to saved places
      }
    });
  };

  return (
    <div className="place-to-stay-container">
      {/* Search District Button Above the Cards */}
      <div className="search-district-container">
        <button className="search-district-button">Search District</button>
      </div>

      {/* Render each travel place item */}
      <div className="places-cards-container">
        {places.map((item, index) => (
          <div key={index} className="place-card">
            {/* Main Image */}
            <div
              className="place-image"
              style={{ backgroundImage: `url(${item.mainImageUrl})` }}
            >
              {/* Save Button */}
              <button
                className={`save-button ${savedPlaces.includes(item.id) ? 'save-button-active' : ''}`}
                onClick={(e) => toggleSave(item.id, e)}
                aria-label="Save this place"
              >
                <span>+</span> Add
              </button>
            </div>

            {/* Place Information */}
            <div className="place-info">
              <h3 className="place-name">{item.name}</h3>
              <p className="place-reviews">{item.reviews} reviews</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesToStay;
