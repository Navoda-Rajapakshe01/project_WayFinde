import "./BestLocations.css";
import LocationCard from "../../LocationCard/LocationCard";
import React, { useState, useEffect } from "react";

const BestLocations = () => {
  const [locations, setLocations] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
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
    <div>
      <div className="best-locations">
        <h1>Best Locations</h1>
        <div className="location-section">
          <div className="location-cards">
            {displayedLocations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
          <br />
          <br />
          {!showAll && (
            <button className="see-more" onClick={() => setShowAll(true)}>
              See More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestLocations;
