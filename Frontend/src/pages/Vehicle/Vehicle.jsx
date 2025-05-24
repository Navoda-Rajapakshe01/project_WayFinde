import React, { useEffect, useState } from "react";
import HeroSection from "../../Components/HeroSection/HeroSection.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import {
  Modal,
  Button,
  Form,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import VehicleCard from "./VehicleCardTraveller.jsx"; // Adjust path if needed
import FilterSection from "./FilterSection.jsx"; // Adjust path
import DestinationTags from "./DestinationTags.jsx"; // Adjust path
import "../CSS/vehicle.css"; // Adjust path

const Vehicle = ({ isSignedIn = true }) => {
  const [vehicles, setVehicles] = useState([]);
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);

  const popularDestinations = [
    "Colombo",
    "Kandy",
    "Galle",
    "Nuwara Eliya",
    "Ella",
    "Negombo",
  ];

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5030/api/Vehicle");
        const allVehicles = response.data;
        setVehicles(allVehicles);
        setFeaturedVehicles(allVehicles.slice(0, 6));

        const recentlyViewedIds =
          JSON.parse(localStorage.getItem("recentlyViewedVehicles")) || [];
        const recentVehicles = allVehicles
          .filter((v) => recentlyViewedIds.includes(v.id))
          .slice(0, 3);
        setRecentlyViewed(recentVehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setVehicles([]);
        setFeaturedVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleFilterChange = (newFilters) => setFilters(newFilters);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 4);

  const handleBookNow = (vehicle) => {
    // Assuming you want to handle vehicle details view here instead of booking modal
    console.log(vehicle);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading vehicles...</p>
      </div>
    );
  }

  return (
    <>
      <HeroSection
        title="Your Journey, Your Ride"
        subtitle="Discover and reserve top vehicles for your travel"
        backgroundImage="https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg"
        color="black"
        placeHolder="Search for vehicles..."
      />
      <div className="vehicle-page-container">
        <FilterSection onFilterChange={handleFilterChange} />

        {/* Featured Vehicles */}
        <section className="vehicle-featured-section">
          <h2 className="vehicle-section-title">Featured Vehicles</h2>
          <div className="vehicle-card-grid">
            {featuredVehicles.slice(0, visibleCount).map((vehicle, index) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isSignedIn={isSignedIn}
                onBookNow={() => handleBookNow(vehicle)} // This can be for navigating or viewing vehicle details
              />
            ))}
          </div>
          {visibleCount < featuredVehicles.length && (
            <button className="load-more-btn" onClick={handleLoadMore}>
              Load More
            </button>
          )}
        </section>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section>
            <h2 className="vehicle-section-title">Recently Viewed Vehicles</h2>
            <div className="vehicle-card-grid">
              {recentlyViewed.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isSignedIn={isSignedIn}
                  onBookNow={() => handleBookNow(vehicle)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Popular Destinations */}
        <DestinationTags destinations={popularDestinations} />
      </div>
    </>
  );
};

export default Vehicle;
