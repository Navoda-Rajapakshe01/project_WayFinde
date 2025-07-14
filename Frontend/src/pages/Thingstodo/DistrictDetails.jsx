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
          setFilteredPlaces(res.data); // Show all by default
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
    <div className="ttd-district-places-container">
      <header className="ttd-district-header">
        <h2 className="ttd-district-title">Places to Visit</h2>
        <p className="ttd-district-subtitle">
          Explore the best attractions in {slug.replace(/-/g, " ")}
        </p>
      </header>

      {/* Categories Component */}
      <div className="ttd-categories-wrapper">
        <Categories places={places} setFilteredPlaces={setFilteredPlaces} />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="ttd-loading-container">
          <div className="ttd-loading-spinner"></div>
          <p>Loading places...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="ttd-error-container">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="ttd-retry-button"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Places Grid */}
      {!loading && !error && (
        <div className="ttd-places-grid">
          {filteredPlaces.length ? (
            filteredPlaces.map((place) => (
              <div
                key={place.id}
                className="ttd-place-card"
                onClick={() => handleCardClick(place.id)}
              >
                <div className="ttd-place-image-container">
                  <img
                    src={place.mainImageUrl || "/placeholder.jpg"}
                    alt={place.name}
                    className="ttd-place-image"
                  />
                  {place.category && (
                    <span className="ttd-place-category">{place.category}</span>
                  )}
                </div>
                <div className="ttd-place-info">
                  <h3 className="ttd-place-name">{place.name}</h3>
                  <button
                    className="ttd-view-details-btn"
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
            <p className="ttd-no-places">No places available for this category.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DistrictDetails;
