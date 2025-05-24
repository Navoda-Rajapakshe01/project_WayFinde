import React from "react";
//import "../../CSS/accommodation.css";

const PopularLocations = ({ locations }) => {
  return (
    <section className="popular-locations-section">
      <h2 className="accommodation-section-title">Popular Destinations</h2>
      <div className="locations-grid">
        {locations.map((location, index) => (
          <div key={index} className="location-card">
            <img
              src={`https://via.placeholder.com/300x200?text=${location}`}
              alt={location}
              className="location-image"
            />
            <div className="location-overlay">
              <h3 className="location-name">{location}</h3>
              <p className="location-count">
                {Math.floor(Math.random() * 20) + 5} properties
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularLocations;
