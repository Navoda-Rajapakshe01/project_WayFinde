import React, { useState, useEffect } from "react";
import LocationCard from "../LocationCard/LocationCard";
import "./LocationSection.css";

const LocationSection = () => {
  const [locations, setLocations] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Fetch data from your database (e.g., API call to fetch locations)
    // Replace with your actual API call
    const fetchedLocations = [
      {
        id: 1,
        name: "Paris",
        description: "City of lights",
        image: "/images/paris.jpg",
      },
      {
        id: 2,
        name: "New York",
        description: "The Big Apple",
        image: "/images/new-york.jpg",
      },
      {
        id: 3,
        name: "Tokyo",
        description: "Land of the Rising Sun",
        image: "/images/tokyo.jpg",
      },
      {
        id: 4,
        name: "London",
        description: "Historic city",
        image: "/images/london.jpg",
      },
      {
        id: 5,
        name: "Dubai",
        description: "Modern city",
        image: "/images/dubai.jpg",
      },
      {
        id: 6,
        name: "Sydney",
        description: "Harbor city",
        image: "/images/sydney.jpg",
      },
    ];

    setLocations(fetchedLocations);
  }, []);

  const displayedLocations = showAll ? locations : locations.slice(0, 4);

  return (
    <div className="location-section">
      <h2>Best Locations</h2>
      <div className="location-cards">
        {displayedLocations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
      {!showAll && (
        <button className="see-more" onClick={() => setShowAll(true)}>
          See More
        </button>
      )}
    </div>
  );
};

export default LocationSection;
