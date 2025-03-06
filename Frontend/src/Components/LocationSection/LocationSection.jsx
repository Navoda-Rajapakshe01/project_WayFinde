import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import LocationCard from "../LocationCard/LocationCard";
import "./LocationSection.css";

const LocationSection = () => {
  const [locations, setLocations] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    // Fetch data from your database (e.g., API call to fetch locations)
    // Replace with your actual API call
    const fetchedLocations = [
      {
        id: 1,
        name: "Paris",
        description: "City of lights",
        image: "/images/paris.jpg",
        updatedAt: "2023-10-01", // Add a timestamp or date field
      },
      {
        id: 2,
        name: "New York",
        description: "The Big Apple",
        image: "/images/new-york.jpg",
        updatedAt: "2023-10-05",
      },
      {
        id: 3,
        name: "Tokyo",
        description: "Land of the Rising Sun",
        image: "/images/tokyo.jpg",
        updatedAt: "2023-10-03",
      },
      {
        id: 4,
        name: "London",
        description: "Historic city",
        image: "/images/london.jpg",
        updatedAt: "2023-10-07",
      },
      {
        id: 5,
        name: "Dubai",
        description: "Modern city",
        image: "/images/dubai.jpg",
        updatedAt: "2023-10-02",
      },
      {
        id: 6,
        name: "Sydney",
        description: "Harbor city",
        image: "/images/sydney.jpg",
        updatedAt: "2023-10-06",
      },
    ];

    // Sort locations by the `updatedAt` field in descending order (newest first)
    const sortedLocations = fetchedLocations.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    setLocations(sortedLocations);
  }, []);

  // Display only the first 4 newest locations initially
  const displayedLocations = showAll ? locations : locations.slice(0, 4);

  // Function to handle "See More" button click
  const handleSeeMoreClick = () => {
    navigate("/locations"); // Use navigate to redirect to the locations page
  };

  return (
    <div className="location-section">
      <h2>Best Locations</h2>
      <div className="location-cards">
        {displayedLocations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
      {!showAll && (
        <button className="see-more" onClick={handleSeeMoreClick}>
          See More
        </button>
      )}
    </div>
  );
};

export default LocationSection;
