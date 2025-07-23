import React, { useState, useEffect } from 'react';
import './PlacesToStay.css';
import { AiOutlineHeart, AiOutlinePlusCircle } from "react-icons/ai";

const PlacesToStay = ({ tripId }) => {
  // State management
  const [savedAccommodations, setSavedAccommodations] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const [accommodationReviews, setAccommodationReviews] = useState({});
  const [accommodationImages, setAccommodationImages] = useState({});
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [loadingAccommodations, setLoadingAccommodations] = useState(false);
  const [error, setError] = useState(null);

  // Fetch trip places on component mount
  useEffect(() => {
    if (tripId) {
      fetchTripPlaces();
      fetchSavedAccommodations();
    }
  }, [tripId]);

  // Fetch accommodations when a place is selected
  useEffect(() => {
    if (selectedPlace) {
      fetchAccommodationsForPlace();
    }
  }, [selectedPlace]);

  const fetchTripPlaces = async () => {
    try {
      setLoadingPlaces(true);
      // Fetch all trip places
      const response = await fetch('http://localhost:5030/api/TripPlaces');
      if (!response.ok) throw new Error('Failed to fetch trip places');
      const allTripPlacesDataRaw = await response.json();
      const allTripPlacesData = Array.isArray(allTripPlacesDataRaw.$values) ? allTripPlacesDataRaw.$values : allTripPlacesDataRaw;
      // Filter places by the specific tripId
      const tripPlacesData = allTripPlacesData.filter(tripPlace => 
        String(tripPlace.tripId) === String(tripId)
      );
      // Fetch place names for each trip place
      const placesWithNames = await Promise.all(
        tripPlacesData.map(async (tripPlace) => {
          try {
            const placeResponse = await fetch(`http://localhost:5030/api/Places/${tripPlace.placeId}`);
            if (placeResponse.ok) {
              const placeDataRaw = await placeResponse.json();
              const placeData = Array.isArray(placeDataRaw.$values) ? placeDataRaw.$values[0] : placeDataRaw;
              return { ...tripPlace, placeName: placeData.name };
            }
            return { ...tripPlace, placeName: `Place ${tripPlace.placeId}` };
          } catch (error) {
            return { ...tripPlace, placeName: `Place ${tripPlace.placeId}` };
          }
        })
      );
      setPlaces(placesWithNames);
    } catch (err) {
      setError('Failed to load places');
    } finally {
      setLoadingPlaces(false);
    }
  };

  const fetchAccommodationsForPlace = async () => {
    try {
      setLoadingAccommodations(true);
      // Fetch all accommodations
      const response = await fetch('http://localhost:5030/api/Accommodation');
      if (!response.ok) throw new Error('Failed to fetch accommodations');
      const accommodationsDataRaw = await response.json();
      const accommodationsData = Array.isArray(accommodationsDataRaw.$values) ? accommodationsDataRaw.$values : accommodationsDataRaw;
      setAccommodations(accommodationsData);
      // Fetch additional details for each accommodation
      accommodationsData.forEach(accommodation => {
        fetchAccommodationReviews(accommodation.id);
        fetchAccommodationImages(accommodation.id);
      });
    } catch (err) {
      setError('Failed to load accommodations');
    } finally {
      setLoadingAccommodations(false);
    }
  };

  const fetchAccommodationReviews = async (accommodationId) => {
    try {
      const response = await fetch(`http://localhost:5030/api/AccommodationReview/accommodation/${accommodationId}`);
      if (response.ok) {
        const reviewsData = await response.json();
        const averageRating = reviewsData.length > 0 
          ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length 
          : 0;
        
        setAccommodationReviews(prev => ({
          ...prev,
          [accommodationId]: {
            rating: averageRating.toFixed(1),
            count: reviewsData.length,
            reviews: reviewsData
          }
        }));
      }
    } catch (err) {
      console.error('Failed to fetch accommodation reviews:', err);
    }
  };

  const fetchAccommodationImages = async (accommodationId) => {
    try {
      const response = await fetch(`http://localhost:5030/api/AccommodationImage/accommodation/${accommodationId}`);
      if (response.ok) {
        const imagesData = await response.json();
        setAccommodationImages(prev => ({
          ...prev,
          [accommodationId]: imagesData.length > 0 ? imagesData[0].imageUrl : '/placeholder-accommodation.jpg'
        }));
      }
    } catch (err) {
      console.error('Failed to fetch accommodation images:', err);
    }
  };

  const fetchSavedAccommodations = async () => {
    try {
      const response = await fetch(`http://localhost:5030/api/SavedAccommodation/trip/${tripId}`);
      if (!response.ok) throw new Error();
      const tripSaved = await response.json();
      setSavedAccommodations(tripSaved.map(sa => sa.accommodationId));
    } catch {
      setSavedAccommodations([]);
    }
  };

  const toggleSave = async (accommodationId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const isSaved = savedAccommodations.includes(accommodationId);
    // Optimistically update UI
    setSavedAccommodations(prev =>
      isSaved ? prev.filter(id => id !== accommodationId) : [...prev, accommodationId]
    );
    try {
      if (!tripId) throw new Error("No tripId available");
      if (isSaved) {
        // Remove from saved accommodations in DB
        await fetch(`http://localhost:5030/api/SavedAccommodation/${tripId}/${accommodationId}`, {
          method: "DELETE"
        });
      } else {
        // Add to saved accommodations in DB
        await fetch(`http://localhost:5030/api/SavedAccommodation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tripId, accommodationId })
        });
      }
    } catch (err) {
      // Revert UI if error
      setSavedAccommodations(prev =>
        isSaved ? [...prev, accommodationId] : prev.filter(id => id !== accommodationId)
      );
      alert("Failed to update saved accommodations.");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="star empty">☆</span>);
    }
    return stars;
  };

  return (
    <div className="places-to-stay-container">
      {/* Places Selection */}
      <div className="places-container">
        <h2>Select a Place</h2>
        <div className="places-grid">
          {places.length === 0 && loadingPlaces ? (
            <div style={{ opacity: 0.5, minHeight: 40 }}>Loading places...</div>
          ) : (
            places.map((place) => (
              <div
                key={place.placeId}
                className={`place-card ${selectedPlace?.placeId === place.placeId ? 'selected' : ''}`}
                onClick={() => setSelectedPlace(place)}
              >
                <h3>{place.placeName}</h3>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Accommodations Section */}
      {selectedPlace && (
        <div className="accommodations-section">
          <h2>Available Accommodations in {selectedPlace.placeName}</h2>
          {/* Accommodation Cards */}
          <div className="accommodation-cards-container">
            {accommodations
              .filter(accommodation => accommodation.placeId === selectedPlace.placeId)
              .map((accommodation) => {
                const reviews = accommodationReviews[accommodation.id];
                const imageUrl = accommodationImages[accommodation.id] || '/placeholder-accommodation.jpg';
                return (
                  <div key={accommodation.id} className="accommodation-card">
                    {/* Availability Badge */}
                    <div className="availability-badge">
                      <span className="availability-text">Available</span>
                    </div>
                    {/* Accommodation Image */}
                    <div className="accommodation-image-container">
                      <img 
                        src={imageUrl} 
                        alt={accommodation.name || 'Accommodation'} 
                        className="accommodation-image"
                        onError={(e) => {
                          e.target.src = '/placeholder-accommodation.jpg';
                        }}
                      />
                      {/* Save Button */}
                      <button
                        className={`save-button ${savedAccommodations.includes(accommodation.id) ? 'saved' : ''}`}
                        onClick={(e) => toggleSave(accommodation.id, e)}
                        aria-label="Save this accommodation"
                      >
                        <span style={{ position: "relative", display: "inline-block", width: 22, height: 22 }}>
                          <AiOutlineHeart size={22} color="#111" />
                          <AiOutlinePlusCircle
                            size={12}
                            color="#900D09"
                            style={{
                              position: "absolute",
                              right: -4,
                              bottom: -4,
                              background: "white",
                              borderRadius: "50%",
                              boxShadow: "0 0 0 2px white",
                            }}
                          />
                        </span>
                      </button>
                    </div>
                    {/* Accommodation Info */}
                    <div className="accommodation-info">
                      <div className="accommodation-header">
                        <h3 className="accommodation-name">{accommodation.name || 'Accommodation'}</h3>
                      </div>
                      
                      {/* Location */}
                      <div className="accommodation-location">
                        <span className="location-icon">📍</span>
                        <span className="location-text">{accommodation.location || 'Location not specified'}</span>
                      </div>

                      {/* Accommodation Details */}
                      <div className="accommodation-details">
                        <div className="detail-item">
                          <span className="detail-label">Max Guests:</span>
                          <span className="detail-value">{accommodation.maxGuests || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Price/Night:</span>
                          <span className="detail-value price">Rs:{accommodation.pricePerNight || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Description */}
                      {accommodation.description && (
                        <div className="accommodation-description">
                          <p>{accommodation.description}</p>
                        </div>
                      )}

                      {/* Accommodation Reviews */}
                      <div className="accommodation-reviews">
                        {reviews ? (
                          <div className="rating-container">
                            <div className="stars">
                              {renderStars(parseFloat(reviews.rating))}
                            </div>
                            <span className="rating-text">
                              {reviews.rating} ({reviews.count} reviews)
                            </span>
                          </div>
                        ) : (
                          null
                        )}
                      </div>

                      {/* Book Now Button */}
                      <button 
                        className="book-now-button"
                        onClick={() => {
                          // Handle booking logic here
                          console.log('Booking accommodation:', accommodation.id);
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Show message when no place is selected */}
      {!selectedPlace && places.length > 0 && (
        <div className="no-selection">
          <p>Please select a place to view available accommodations</p>
        </div>
      )}
    </div>
  );
};

export default PlacesToStay;