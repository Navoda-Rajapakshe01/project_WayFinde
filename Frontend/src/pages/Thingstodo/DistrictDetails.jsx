import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/DistrictDetails.css";
import Categories from "../../Components/ThingsToDo/Categories";

const DistrictDetails = () => {
  const { slug } = useParams(); // Get district slug
  const navigate = useNavigate(); // Hook for navigation
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (slug) {
      axios
        .get(`http://localhost:5030/api/places/by-district-name/${slug}`)
        .then((res) => setPlaces(res.data))
        .catch((err) => console.error("Failed to load places:", err));
    }
  }, [slug]);

  const handleCardClick = (placeId) => {
    navigate(`/things-to-do/${slug}/${placeId}`);
  };

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
          <div
            key={place.id}
            className="place-card"
            onClick={() => handleCardClick(place.id)}
            style={{ cursor: "pointer" }}
          >
            <img src={place.mainImageUrl} alt={place.name} />
            <h3>{place.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistrictDetails;
