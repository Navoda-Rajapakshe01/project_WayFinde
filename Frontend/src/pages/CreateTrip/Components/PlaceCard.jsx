import React from "react";
import { Plus } from "lucide-react";
import "./PlaceCard.css";

const PlaceCard = ({ place, onAddPlace, isSelected }) => {
  const {
    id,
    name,
    rating,
    howManyRated,
    avgTime,
    avgSpend,
    googleMapLink,
    mainImageUrl,
  } = place;

  const handleAddClick = (e) => {
    e.stopPropagation();
    onAddPlace(place);
  };

  return (
    <div className={`place-card ${isSelected ? "selected" : ""}`}>
      <div className="place-image-container">
        <img
          src={mainImageUrl}
          alt={name}
          className="place-image"
          onError={(e) => {
            e.target.style.display = "none";
            console.warn(`Image failed to load for ${name}`);
          }}
        />
        <button
          className={`add-button ${isSelected ? "added" : ""}`}
          onClick={() => onAddPlace(place, isSelected)}
        >
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>
            {isSelected ? "−" : "＋"}
          </span>
        </button>
      </div>

      <div className="place-info">
        <h3 className="place-name">{name}</h3>
        <div className="place-rating">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= Math.round(rating) ? "filled" : ""}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-count">({howManyRated || 0})</span>
        </div>
        <div className="place-details">
          <div className="detail">
            <span className="detail-label">Duration:</span>
            <span className="detail-value">{avgTime || "N/A"}</span>
          </div>
          <div className="detail">
            <span className="detail-label">Avg. Spend:</span>
            <span className="detail-value">
              {avgSpend && avgSpend !== 0 ? `Rs. ${avgSpend}` : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
