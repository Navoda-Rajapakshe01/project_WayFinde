import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './VehicleRent.css';
import { AiOutlineHeart, AiOutlinePlusCircle } from "react-icons/ai";

const VehicleRent = ({ tripId }) => {
  // State management
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [savedVehicles, setSavedVehicles] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [vehicleReviews, setVehicleReviews] = useState({});
  const [vehicleImages, setVehicleImages] = useState({});
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [error, setError] = useState(null);

  // Fetch trip places on component mount
  useEffect(() => {
    if (tripId) {
      fetchTripPlaces();
    }
  }, [tripId]);

  // Fetch vehicles when a place is selected
  useEffect(() => {
    if (selectedPlace) {
      fetchVehiclesForPlace();
    }
  }, [selectedPlace]);

  const fetchTripPlaces = async () => {
    try {
      setLoadingPlaces(true);
      // Fetch all trip places
      const response = await fetch('http://localhost:5030/api/TripPlaces');
      if (!response.ok) throw new Error('Failed to fetch trip places');
      const allTripPlacesData = await response.json();
      
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
              const placeData = await placeResponse.json();
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

  const fetchVehiclesForPlace = async () => {
    try {
      setLoadingVehicles(true);
      // Fetch all vehicles (you might want to filter by place if your API supports it)
      const response = await fetch('http://localhost:5030/api/Vehicle');
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      const vehiclesData = await response.json();
      setVehicles(vehiclesData);
      // Fetch additional details for each vehicle
      vehiclesData.forEach(vehicle => {
        fetchVehicleReviews(vehicle.id);
        fetchVehicleImages(vehicle.id);
      });
    } catch (err) {
      setError('Failed to load vehicles');
    } finally {
      setLoadingVehicles(false);
    }
  };

  const fetchVehicleReviews = async (vehicleId) => {
    try {
      const response = await fetch(`http://localhost:5030/api/VehicleReview/vehicle/${vehicleId}`);
      if (response.ok) {
        const reviewsData = await response.json();
        const averageRating = reviewsData.length > 0 
          ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length 
          : 0;
        
        setVehicleReviews(prev => ({
          ...prev,
          [vehicleId]: {
            rating: averageRating.toFixed(1),
            count: reviewsData.length,
            reviews: reviewsData
          }
        }));
      }
    } catch (err) {
      console.error('Failed to fetch vehicle reviews:', err);
    }
  };

  const fetchVehicleImages = async (vehicleId) => {
    try {
      const response = await fetch(`http://localhost:5030/api/VehicleImage/vehicle/${vehicleId}`);
      if (response.ok) {
        const imagesData = await response.json();
        setVehicleImages(prev => ({
          ...prev,
          [vehicleId]: imagesData.length > 0 ? imagesData[0].imageUrl : '/placeholder-vehicle.jpg'
        }));
      }
    } catch (err) {
      console.error('Failed to fetch vehicle images:', err);
    }
  };

  const toggleSave = (vehicleId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedVehicles(prev =>
      prev.includes(vehicleId)
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
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
    <div className="vehicle-rent-container">
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

      {/* Vehicles Section */}
      {selectedPlace && (
        <div className="vehicles-section">
          <h2>Available Vehicles in {selectedPlace.placeName}</h2>
          {/* Vehicle Cards - always render, no loading spinner */}
          <div className="vehicle-cards-container">
            {vehicles
              .filter(vehicle => vehicle.placeId === selectedPlace.placeId)
              .map((vehicle) => {
                const reviews = vehicleReviews[vehicle.id];
                const imageUrl = vehicleImages[vehicle.id] || '/placeholder-vehicle.jpg';
                return (
                  <div key={vehicle.id} className="vehicle-card">
                    {/* Availability Badge */}
                    <div className="availability-badge">
                      <span className="availability-text">Available</span>
                    </div>
                    {/* Vehicle Image */}
                    <div className="vehicle-image-container">
                      <img 
                        src={imageUrl} 
                        alt={vehicle.name || 'Vehicle'} 
                        className="vehicle-image"
                        onError={(e) => {
                          e.target.src = '/placeholder-vehicle.jpg';
                        }}
                      />
                      {/* Save Button */}
                      <button
                        className={`save-button ${savedVehicles.includes(vehicle.id) ? 'saved' : ''}`}
                        onClick={(e) => toggleSave(vehicle.id, e)}
                        aria-label="Save this vehicle"
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
                    {/* Vehicle Info */}
                    <div className="vehicle-info">
                      <div className="vehicle-header">
                        <h3 className="vehicle-name">{vehicle.brand || 'Vehicle'}</h3>
                        <div className="vehicle-type">{vehicle.type || 'Car'}</div>
                      </div>
                      {/* Vehicle Details */}
                      <div className="vehicle-details">
                        <div className="detail-item">
                          <span className="detail-label">Passengers:</span>
                          <span className="detail-value">{vehicle.numberOfPassengers || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Transmission:</span>
                          <span className="detail-value">{vehicle.transmissionType || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Fuel:</span>
                          <span className="detail-value">{vehicle.fuelType || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Price/Day:</span>
                          <span className="detail-value price">${vehicle.pricePerDay || 'N/A'}</span>
                        </div>
                      </div>
                      {/* Vehicle Reviews */}
                      <div className="vehicle-reviews">
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
                          console.log('Booking vehicle:', vehicle.id);
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
          <p>Please select a place to view available vehicles</p>
        </div>
      )}
    </div>
  );
};

export default VehicleRent;