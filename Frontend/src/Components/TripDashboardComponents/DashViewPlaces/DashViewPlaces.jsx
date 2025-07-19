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

  const WEATHER_API_KEY = '8bfbf09eafdd4cbbb64131601251105';

  useEffect(() => {
    if (isOpen) {
      fetchPlaces();
    }
  }, [isOpen]);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5030/api/TripPlaces');
      const data = await response.json();
      // Filter places by tripId
      const filtered = data.filter(place => String(place.tripId) === String(tripId));
      // Fetch place details for each TripPlace to get the name
      const placesWithNames = await Promise.all(
        filtered.map(async (tp) => {
          try {
            const placeRes = await fetch(`http://localhost:5030/api/Places/${tp.placeId}`);
            const placeData = await placeRes.json();
            return { ...tp, name: placeData.name, mainImageUrl: placeData.mainImageUrl, openingHours: placeData.openingHours, googleMapLink: placeData.googleMapLink };
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

  const extractLocationFromGoogleMap = (googleMapLink) => {
    try {
      const urlObj = new URL(googleMapLink);
      const searchParams = urlObj.searchParams;
      let lat, lng;

      if (searchParams.has('ll')) {
        const coords = searchParams.get('ll').split(',');
        lat = parseFloat(coords[0]);
        lng = parseFloat(coords[1]);
      }

      if (!lat || !lng) {
        const pathMatch = googleMapLink.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
        if (pathMatch) {
          lat = parseFloat(pathMatch[1]);
          lng = parseFloat(pathMatch[2]);
        }
      }

      if (!lat || !lng) {
        const queryMatch = googleMapLink.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
        if (queryMatch) {
          lat = parseFloat(queryMatch[1]);
          lng = parseFloat(queryMatch[2]);
        }
      }

      return { lat, lng };
    } catch (error) {
      console.error('Error extracting location from Google Maps link:', error);
      return null;
    }
  };

  const fetchWeatherData = async (place) => {
    // Always use the GoogleMapLink from the place details (fetched from /api/Places)
    if (!place?.googleMapLink) {
      setWeatherData(null);
      return;
    }
    setWeatherLoading(true);

    try {
      const location = extractLocationFromGoogleMap(place.googleMapLink);

      if (!location || !location.lat || !location.lng) {
        console.error('Could not extract coordinates from Google Maps link');
        setWeatherData(null);
        return;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${WEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather API request failed');
      }

      const data = await response.json();
      setWeatherData(data);
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
                                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                                alt={weatherData.weather[0].description}
                              />
                            </div>
                            <div className="dash-view-weather-temp">
                              {Math.round(weatherData.main.temp)}°C
                            </div>
                          </div>

                          <div className="dash-view-weather-description">
                            {weatherData.weather[0].description}
                          </div>

                          <div className="dash-view-weather-details">
                            <div className="dash-view-weather-detail">
                              <span className="dash-view-weather-label">Feels like</span>
                              <span className="dash-view-weather-value">
                                {Math.round(weatherData.main.feels_like)}°C
                              </span>
                            </div>
                            <div className="dash-view-weather-detail">
                              <span className="dash-view-weather-label">Humidity</span>
                              <span className="dash-view-weather-value">
                                {weatherData.main.humidity}%
                              </span>
                            </div>
                            <div className="dash-view-weather-detail">
                              <span className="dash-view-weather-label">Wind Speed</span>
                              <span className="dash-view-weather-value">
                                {weatherData.wind.speed} m/s
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