import React from "react";
import { useNavigate } from "react-router-dom";
import "./DistrictCard.css";

const DistrictCard = ({ name, image, PlacesCount }) => {
  const navigate = useNavigate();

  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const handleClick = () => {
    // Navigate to the route showing the places for that district
    navigate(`/things-to-do/${slug}`);
  };

  return (
    <div className="district-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <img src={image} alt={name} className="district-image" />
      <h3 className="district-name">{name}</h3>
      <p className="district-count">{PlacesCount} place{PlacesCount !== 1 ? "s" : ""}</p>
    </div>
  );
};

export default DistrictCard;
