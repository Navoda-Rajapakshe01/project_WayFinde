"use client";
import React from "react";
import { useEffect, useState } from "react";
import HeroSection from "../../Components/HeroSection/HeroSection";
import MainNavbar from "../../Components/MainNavbar/MainNavbar";
import DistrictCard from "../../Components/ThingsToDo/DistrictCard";
import "../CSS/ThingsToDo.css";
import axios from "axios";

const ThingsToDo = () => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    axios
      .get("http://localhost:5030/api/district")
      .then((response) => {
        setDistricts(response.data.$values);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching district data:", error);
        setError("Failed to load districts. Please try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container">
      <HeroSection
        title={<>Discover & Explore: Unmissable Experiences Await!</>}
        backgroundImage="https://res.cloudinary.com/enchanting/q_70,f_auto,c_lfill,g_auto/exodus-web/2022/05/sri-lanka.jpg"
        placeHolder="Search Your Destination Here..."
        color="black"
        showSearchBar={true}
      />

      <div className="ttd-content-section">
        <div className="ttd-section-header">
          <h2 className="ttd-section-title">Explore by District</h2>
          <p className="ttd-section-subtitle">
            Discover the unique charm and attractions of each region
          </p>
        </div>

        {loading && (
          <div className="ttd-loading-container">
            <div className="ttd-loading-spinner"></div>
            <p>Loading districts...</p>
          </div>
        )}

        {error && !loading && (
          <div className="ttd-error-container">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="ttd-retry-button">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <section className="district-container">
            {districts.length > 0 ? (
              districts.map((district) => (
                <DistrictCard
                  key={district.id}
                  name={district.name}
                  image={district.imageUrl}
                  PlacesCount={district.placesCount}
                />
              ))
            ) : (
              <div className="no-districts">
                <p>
                  No districts available at the moment. Please check back later.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default ThingsToDo;
