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
      <MainNavbar />
      <HeroSection
        title={<>Discover & Explore: Unmissable Experiences Await!</>}
        backgroundImage="https://res.cloudinary.com/enchanting/q_70,f_auto,c_lfill,g_auto/exodus-web/2022/05/sri-lanka.jpg"
        placeHolder="Search Your Destination Here..."
        color="black"
      />

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
      </div>
    </div>
  );
};

export default ThingsToDo;
