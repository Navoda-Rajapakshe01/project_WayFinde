import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../CSS/DistrictDetails.css";
import Categories from "../../Components/ThingsToDo/Categories";

const DistrictDetails = () => {
  const { districtId } = useParams(); // Get district ID from the URL
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5030/api/places/by-district/${districtId}`) // Fetch places by district ID
      .then((res) => setPlaces(res.data))
      .catch((err) => console.error("Failed to load places:", err));
  }, [districtId]); // Re-fetch if districtId changes

  return (
    <div className="district-places-container">

      <h2
        style={{
          textAlign: "center",
          marginTop: "60px",
          fontSize: "2.5rem",
          fontWeight: "600",
          color: "#2c3e50",
          letterSpacing: "1px",
          textTransform: "uppercase",
          position: "relative",
          paddingBottom: "10px",
        }}
      >
        Places to Visit
      </h2>
      
      <Categories />
      
      <div className="places-grid">
        {places.map((place) => (
          <div key={place.id} className="place-card">
            <img src={place.mainImageUrl} alt={place.name} />
            <h3>{place.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistrictDetails;
