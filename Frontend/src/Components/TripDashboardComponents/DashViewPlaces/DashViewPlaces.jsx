import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaMapMarkerAlt,
  FaClock,
  FaExternalLinkAlt
} from 'react-icons/fa';
import './DashViewPlaces.css';

const DashViewPlaces = ({ isOpen, tripId, onClose }) => {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log('Modal is open, calling fetchPlaces');
      fetchPlaces();
    }
  }, [isOpen]);

  const fetchPlaces = async () => {
    console.log('fetchPlaces called');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5030/api/TripPlaces');
      const data = await response.json();
      console.log('TripPlaces API response:', data);
      const tripPlacesArray = Array.isArray(data.$values) ? data.$values : [];
      if (tripPlacesArray.length === 0) {
        setPlaces([]);
        setSelectedPlace(null);
        setWeatherData(null);
        setLoading(false);
        return;
      }
      // Filter places by tripId
      const filtered = tripPlacesArray.filter(place => String(place.tripId) === String(tripId));
      // Fetch place details for each TripPlace to get the name
      const placesWithNames = await Promise.all(
        filtered.map(async (tp) => {
          try {
            const placeRes = await fetch(`http://localhost:5030/api/Places/${tp.placeId}`);
            const placeData = await placeRes.json();
            return { ...tp, name: placeData.name, mainImageUrl: placeData.mainImageUrl, openingHours: placeData.openingHours };
          } catch {
            return { ...tp, name: 'Unknown Place' };
          }
        })
      );
      setPlaces(placesWithNames);
      if (placesWithNames.length > 0) {
        setSelectedPlace(placesWithNames[0]);
        fetchWeatherData(placesWithNames[0]);
      } else {
        setSelectedPlace(null);
        setWeatherData(null);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async (place) => {
    if (!place?.name) {
      setWeatherData(null);
      return;
    }
    setWeatherLoading(true);

    try {
      // Use your backend API instead of calling external APIs directly
      const weatherResponse = await fetch(
        `http://localhost:5030/api/Weather/${encodeURIComponent(place.name)}`
      );

      if (!weatherResponse.ok) {
        throw new Error('Weather API request failed');
      }

      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    fetchWeatherData(place);
  };

  const handleClose = () => {
    setSelectedPlace(null);
    setWeatherData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dash-view-places-overlay">
      <div className="dash-view-places-modal">
        <div className="dash-view-places-header">
          <h2 className="dash-view-places-title">View All Places</h2>
          <button className="dash-view-places-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="dash-view-places-content">
          {loading ? (
            <div className="dash-view-places-loading">
              <div className="loading-spinner"></div>
              <p>Loading places...</p>
            </div>
          ) : (
            <>
              <div className="dash-view-places-nav">
                {places.map((place, index) => (
                  <button
                    key={place.placeId}
                    className={`dash-view-place-nav-button ${
                      selectedPlace?.placeId === place.placeId ? 'active' : ''
                    }`}
                    onClick={() => handlePlaceClick(place)}
                  >
                    {place.name}
                  </button>
                ))}
              </div>

              <div className="dash-view-places-main">
                {selectedPlace ? (
                  <>
                    <div className="dash-view-place-card">
                      <div className="dash-view-place-image">
                        {selectedPlace.mainImageUrl ? (
                          <img
                            src={selectedPlace.mainImageUrl}
                            alt={selectedPlace.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="dash-view-place-image-placeholder">
                          <FaMapMarkerAlt />
                          <span>Place Image</span>
                        </div>
                      </div>

                      <div className="dash-view-place-info">
                        <div className="dash-view-place-details">
                          <h3 className="dash-view-place-name">{selectedPlace.name}</h3>
                          <p className="dash-view-place-description">
                            Discover the beauty and charm of {selectedPlace.name}. A perfect destination for your travel adventure.
                          </p>

                          <div className="dash-view-place-hours">
                            <FaClock className="dash-view-place-hours-icon" />
                            <span>{selectedPlace.openingHours || 'Hours not available'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="dash-view-weather-card">
                      <h3 className="dash-view-weather-title">{selectedPlace.name} Weather</h3>

                      {weatherLoading ? (
                        <div className="dash-view-weather-loading">
                          <div className="loading-spinner small"></div>
                          <p>Loading weather...</p>
                        </div>
                      ) : weatherData ? (
                        <div className="dash-view-weather-content">
                          <div className="dash-view-weather-main">
                            <div className="dash-view-weather-icon">
                              <img
                                src={`https:${weatherData.icon}`}
                                alt={weatherData.description}
                              />
                            </div>
                            <div className="dash-view-weather-temp">
                              {Math.round(weatherData.temperature)}°C
                            </div>
                          </div>

                          <div className="dash-view-weather-description">
                            {weatherData.description}
                          </div>

                          <div className="dash-view-weather-details">
                            <div className="dash-view-weather-detail">
                              <span className="dash-view-weather-label">Feels like</span>
                              <span className="dash-view-weather-value">
                                {Math.round(weatherData.feelsLike)}°C
                              </span>
                            </div>
                            <div className="dash-view-weather-detail">
                              <span className="dash-view-weather-label">Humidity</span>
                              <span className="dash-view-weather-value">
                                {weatherData.humidity}%
                              </span>
                            </div>
                            <div className="dash-view-weather-detail">
                              <span className="dash-view-weather-label">Wind Speed</span>
                              <span className="dash-view-weather-value">
                                {weatherData.windSpeed} km/h
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="dash-view-weather-error">
                          <p>Weather data not available</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="dash-view-places-empty">
                    <FaMapMarkerAlt />
                    <p>No places available</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashViewPlaces;