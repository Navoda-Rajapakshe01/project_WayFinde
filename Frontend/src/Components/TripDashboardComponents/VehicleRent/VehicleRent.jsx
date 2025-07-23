import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './VehicleRent.css';
import { AiOutlineHeart, AiOutlinePlusCircle } from "react-icons/ai";

const VehicleRent = ({ sharedMode = false, tripId }) => {
  // State for managing selected dates
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

  useEffect(() => {
    if (tripId) {
      fetchSavedVehicles();
    }
  }, [tripId]);

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

  const fetchVehiclesForPlace = async () => {
    try {
      setLoadingVehicles(true);
      // Fetch all vehicles (you might want to filter by place if your API supports it)
      const response = await fetch('http://localhost:5030/api/Vehicle');
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      const vehiclesDataRaw = await response.json();
      const vehiclesData = Array.isArray(vehiclesDataRaw.$values) ? vehiclesDataRaw.$values : vehiclesDataRaw;
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

  const fetchSavedVehicles = async () => {
    try {
      const response = await fetch(`http://localhost:5030/api/SavedVehicle`);
      if (!response.ok) throw new Error();
      const allSaved = await response.json();
      // Filter for this trip
      setSavedVehicles(allSaved.filter(sv => sv.tripId === tripId).map(sv => sv.vehicleId));
    } catch {
      setSavedVehicles([]);
    }
  };

  const toggleSave = async (vehicleId, e) => {
    e.preventDefault();
    e.stopPropagation();

    const isSaved = savedVehicles.includes(vehicleId);

    // Optimistically update UI
    setSavedVehicles(prev =>
      isSaved ? prev.filter(id => id !== vehicleId) : [...prev, vehicleId]
    );

    try {
      if (!tripId) throw new Error("No tripId available");

      if (isSaved) {
        // Remove from saved vehicles in DB
        await fetch(`http://localhost:5030/api/SavedVehicle/${tripId}/${vehicleId}`, {
          method: "DELETE"
        });
      } else {
        // Add to saved vehicles in DB
        await fetch(`http://localhost:5030/api/SavedVehicle`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tripId, vehicleId })
        });
      }
    } catch (err) {
      // Revert UI if error
      setSavedVehicles(prev =>
        isSaved ? [...prev, vehicleId] : prev.filter(id => id !== vehicleId)
      );
      alert("Failed to update saved vehicles.");
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
    <div className="vehicle-rent-container">
      {/* Place Selection Section */}
      {places.length > 0 && (
        <div className="places-containers">
          <h3>Select a Place</h3>
          <div className="places-grid">
            {places.map((place) => (
              <div
                key={place.placeId}
                className={`place-card ${selectedPlace?.placeId === place.placeId ? 'selected' : ''}`}
                onClick={() => setSelectedPlace(place)}
              >
                <h3>{place.placeName}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading and Error States */}
      {loadingPlaces && <div className="loading">Loading places...</div>}
      {loadingVehicles && <div className="loading">Loading vehicles...</div>}
      {error && <div className="error">{error}</div>}

      {/* Vehicles List Section */}
      <div className="vehicle-cards-container">
        {vehicles.map((vehicle, index) => (
          <div key={vehicle.id || index} className="vehicle-card">
            {/* Main Image */}
            <div
              className="vehicle-image"
              style={{ 
                backgroundImage: `url(${vehicleImages[vehicle.id] || vehicle.mainImageUrl || '/placeholder-vehicle.jpg'})` 
              }}
            >
              {/* Save Button */}
              <button
                className={`save-button ${savedVehicles.includes(vehicle.id) ? 'save-button-active' : ''}`}
                onClick={(e) => toggleSave(vehicle.id, e)}
                aria-label="Save this vehicle"
                disabled={sharedMode}
              >
                <span>+</span> Add
              </button>
            </div>
            <div className="vehicle-info">
              <h4 className="vehicle-name">{vehicle.name || vehicle.make + ' ' + vehicle.model}</h4>
              <div className="vehicle-details">
                <span>{vehicle.seats || vehicle.seatCount || 'N/A'} Seats</span>
                <span>{vehicle.bags || vehicle.bagCapacity || 'N/A'} Bags</span>
              </div>
              <div className="vehicle-rating">
                {vehicleReviews[vehicle.id] ? (
                  <span>⭐ {vehicleReviews[vehicle.id].rating} ({vehicleReviews[vehicle.id].count} reviews)</span>
                ) : (
                  <span>⭐ No ratings yet</span>
                )}
              </div>
              <div className="vehicle-price">
                <span>LKR {vehicle.pricePerDay || vehicle.price || 'N/A'}/day</span>
              </div>
              <button className="book-now-button">Book Now</button>
              <span className="availability-status available">Available</span>
            </div>
          </div>
        ))}
      </div>

      {/* Show message when no place is selected */}
      {!selectedPlace && places.length > 0 && !loadingPlaces && (
        <div className="no-selection">
          <p>Please select a place to view available vehicles</p>
        </div>
      )}

      {/* Show message when no vehicles found */}
      {selectedPlace && vehicles.length === 0 && !loadingVehicles && (
        <div className="no-vehicles">
          <p>No vehicles available for the selected place</p>
        </div>
      )}
    </div>
  );
};

export default VehicleRent;