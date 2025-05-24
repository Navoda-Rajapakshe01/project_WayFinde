import React, { useEffect, useState } from "react";
import HeroSection from "../../Components/HeroSection/HeroSection";
import MainNavbar from "../../Components/MainNavbar/MainNavbar";
import DistrictCard from "../../Components/ThingsToDo/DistrictCard";
import "../CSS/ThingsToDo.css";
import axios from "axios";

const ThingsToDo = () => {
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5030/api/district") 
      .then((response) => {
        setDistricts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching district data:", error);
      });
  }, []);

  return (
    <div className="page-container">
<<<<<<< Updated upstream
      <MainNavbar />
=======
>>>>>>> Stashed changes
      <HeroSection
        title={<>Discover & Explore: Unmissable Experiences Await!</>}
        backgroundImage="https://res.cloudinary.com/enchanting/q_70,f_auto,c_lfill,g_auto/exodus-web/2022/05/sri-lanka.jpg"
        placeHolder="Search Your Destination Here..."
        color="black"
      />

<<<<<<< Updated upstream
      <div>
        <h2
          style={{
            textAlign: "center",
            marginTop: "40px",
            fontSize: "2.5rem",
            fontWeight: "600",
            color: "#2c3e50",
            letterSpacing: "1px",
            textTransform: "uppercase",
            position: "relative",
            paddingBottom: "10px",
          }}
        >
          Explore by District
        </h2>
        <section className="district-container">
          {districts.map((district) => (
            <DistrictCard
              key={district.id}
              name={district.name}
              image={district.imageUrl} 
              districtId={district.id}
            />
          ))}
        </section>
=======
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Explore by District</h2>
          <p className="section-subtitle">
            Discover the unique charm and attractions of each region
          </p>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading districts...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-container">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="retry-button">
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
>>>>>>> Stashed changes
      </div>
    </div>
  );
};

export default ThingsToDo;
