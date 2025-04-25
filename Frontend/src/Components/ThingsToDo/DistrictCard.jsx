import React from "react";
import { useNavigate } from "react-router-dom";
import "./DistrictCard.css";


const DistrictCard = ({ name, image, districtId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the route showing the places for that district
    navigate(`/thingstodo/${districtId}`);
  };

  return (
    <div className="district-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <img src={image} alt={name} className="district-image" />
      <h3 className="district-name">{name}</h3>
      
    </div>
  );
};

export default DistrictCard;
