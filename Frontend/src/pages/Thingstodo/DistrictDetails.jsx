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

  // Handle navigation to detailed page of the place
  const handleCardClick = (placeId) => {
    navigate(`/things-to-do/${slug}/${placeId}`);
  };

  return (
    <div className="district-places-container">
      <header className="district-header">
        <h2 className="district-title">Places to Visit</h2>
        <p className="district-subtitle">
          Explore the best attractions in {slug.replace(/-/g, " ")}
        </p>
      </header>

      {/* Categories Component */}
      <div className="categories-wrapper">
        <Categories />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading places...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      )}

      {/* Places Grid */}
      {!loading && !error && (
        <div className="places-grid">
          {places.length ? (
            places.map((place) => (
              <div
                key={place.id}
                className="place-card"
                onClick={() => handleCardClick(place.id)}
              >
                <div className="place-image-container">
                  <img
                    src={place.mainImageUrl || "/placeholder.jpg"}
                    alt={place.name}
                    className="place-image"
                  />
                  {place.category && <span className="place-category">{place.category}</span>}
                </div>
                <div className="place-info">
                  <h3 className="place-name">{place.name}</h3>
                  {place.shortDescription && (
                    <p className="place-description">{place.shortDescription}</p>
                  )}
                  <button
                    className="view-details-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering card click
                      handleCardClick(place.id);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-places">No places available for this district.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DistrictDetails;
