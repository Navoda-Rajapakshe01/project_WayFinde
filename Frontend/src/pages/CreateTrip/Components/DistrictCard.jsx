import React from "react";
import "./DistrictCard.css";

const DistrictCard = ({ district, onClick }) => {
  const { name: districtName, imageUrl, subTitle } = district;

  // Fallback image if missing
  const defaultImage = `/placeholder.svg?height=200&width=300&query=${districtName} Sri Lanka`;

  return (
    <div className="district-card" onClick={onClick}>
      <div className="district-image-container">
        <img
          src={imageUrl || defaultImage}
          alt={districtName}
          className="district-image"
        />
      </div>
      <div className="district-info">
        <h3 className="district-name">{districtName}</h3>
        {subTitle && <p className="district-type">{subTitle}</p>}
      </div>
    </div>
  );
};

export default DistrictCard;
