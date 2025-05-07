import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LocationCard from "../LocationCard/LocationCard";
import "./LocationSection.css";
import "../../App.css";

const LocationSection = ({
  title = "Explore Popular Destinations",
  subtitle = "Get inspired for your next adventure by these breathtaking locales.",
}) => {
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:5030/api/places");
        const data = await response.json();

        const sortedLocations = data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setLocations(sortedLocations);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const displayedLocations = locations.slice(0, 4);

  if (displayedLocations.length === 0) {
    return null;
  }

  return (
    <section className="location-section section-padding">
      <div className="container">
        <div className="homesection-header text-center">
          <h2 className="homesection-title">{title}</h2>
          {subtitle && <p className="homesection-subtitle">{subtitle}</p>}
        </div>

        <div className="location-cards-grid">
          {displayedLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>

        {locations.length > displayedLocations.length && (
            <div className="view-all-container text-center">
                <a href="/thingstodo" className="homebtn homebtn-outline">Discover More Destinations</a>
            </div>
        )}
      </div>
    </section>
  );
};

export default LocationSection;
