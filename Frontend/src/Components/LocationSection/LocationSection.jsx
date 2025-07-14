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
        const response = await fetch("http://localhost:5030/api/places/top-rated");
        const data = await response.json();
        setLocations(data); // no need to sort if API already returns top rated
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchLocations();
  }, []);

  // Guard: show nothing if no locations
  if (!locations || locations.length === 0) {
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
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>

        {locations.length >= 4 && (
          <div className="view-all-container text-center">
            <a href="/thingstodo" className="homebtn homebtn-outline">
              Discover More Destinations
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default LocationSection;
