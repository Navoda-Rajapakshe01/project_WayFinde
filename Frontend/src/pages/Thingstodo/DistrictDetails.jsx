import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/DistrictDetails.css";
import "../../App.css";
import Categories from "../../Components/ThingsToDo/Categories";

const DistrictDetails = () => {
  const { slug } = useParams(); // Get district slug
  const navigate = useNavigate(); // Hook for navigation
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch places based on district slug
  useEffect(() => {
    if (slug) {
      setLoading(true);
      axios
        .get(`http://localhost:5030/api/places/by-district-name/${slug}`)
        .then((res) => {
          setPlaces(res.data);
          setFilteredPlaces(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load places:", err);
          setError("Failed to load places. Please try again later.");
          setLoading(false);
        });
    }

    window.scrollTo(0, 0);
  }, [slug]);

  const handleCardClick = (placeId) => {
    navigate(`/things-to-do/${slug}/${placeId}`);
  };

  return (
    <div className="district-details-container">
      <header className="district-details-header">
        <h2 className="district-details-title">Places to Visit</h2>
        <p className="district-details-subtitle">
          Explore the best attractions in {slug.replace(/-/g, " ")}
        </p>
      </header>

      <div className="district-details-categories-wrapper">
        <Categories places={places} setFilteredPlaces={setFilteredPlaces} />
      </div>

      {loading && (
        <div className="district-details-loading">
          <div className="district-details-spinner"></div>
          <p>Loading places...</p>
        </div>
      )}

      {error && !loading && (
        <div className="district-details-error">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="district-details-retry-btn"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="district-details-grid">
          {filteredPlaces.length ? (
            filteredPlaces.map((place) => (
              <div
                key={place.id}
                className="district-details-card"
                onClick={() => handleCardClick(place.id)}
              >
                <div className="district-details-image-wrapper">
                  <img
                    src={place.mainImageUrl || "/placeholder.jpg"}
                    alt={place.name}
                    className="district-details-image"
                  />
                  {place.category && (
                    <span className="district-details-category">
                      {place.category}
                    </span>
                  )}
                </div>
                <div className="district-details-info">
                  <h3 className="district-details-name">{place.name}</h3>
                  <button
                    className="district-details-view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(place.id);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="district-details-no-places">
              No places available for this category.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DistrictDetails;
