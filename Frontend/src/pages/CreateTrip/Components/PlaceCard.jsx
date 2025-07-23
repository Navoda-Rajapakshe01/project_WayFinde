import React from "react";
import "./PlaceCard.css";
import PropTypes from "prop-types";

const PlaceCard = ({ place, onAddPlace, isSelected }) => {
  const { name, rating, avgTime, avgSpend, mainImageUrl } = place;

  return (
    <div className={`place-card-ctr ${isSelected ? "selected" : ""}`}>
      <div className="place-image-container-ctr w-full h-[180px] relative rounded overflow-hidden">
        <img
          src={mainImageUrl}
          alt={name}
          className="place-image absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out"
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

      <div className="place-info-ctr">
        <h3 className="place-name-ctr">{name}</h3>
        <div className="place-rating-ctr">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${
                  star <= Math.round(rating || 0) ? "filled" : ""
                }`}
              >
                ★
              </span>
            ))}
            <span className="rating-number-ctr">
              {rating ? rating.toFixed(1) : "0.0"}
            </span>
          </div>
        </div>

        <div className="place-details-str">
          <div className="detail-ctr">
            <span className="detail-label-ctr">Duration:</span>
            <span className="detail-value-ctr">{avgTime || "N/A"}</span>
          </div>
          <div className="detail-ctr">
            <span className="detail-label-ctr">Avg. Spend:</span>
            <span className="detail-value-ctr">
              {avgSpend && avgSpend !== 0 ? `Rs. ${avgSpend}` : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

PlaceCard.propTypes = {
  place: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    rating: PropTypes.number,
    avgTime: PropTypes.string,
    avgSpend: PropTypes.number,
    googleMapLink: PropTypes.string,
    mainImageUrl: PropTypes.string,
  }).isRequired,
  onAddPlace: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default PlaceCard;
