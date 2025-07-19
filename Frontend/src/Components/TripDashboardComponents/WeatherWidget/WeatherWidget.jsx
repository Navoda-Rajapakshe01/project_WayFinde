import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherWidget.css';

const WeatherWidget = ({ location }) => {
  // State management for weather data, loading state, and error handling
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect hook to fetch and update weather data
  useEffect(() => {
    // Async function to fetch weather data from the API
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // Make API request to get weather data for the specified location
        const response = await axios.get(`/api/weather/${encodeURIComponent(location)}`);
        setWeather(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error('Error fetching weather:', err);
      } finally {
        setLoading(false);
      }
    };

    // Initial weather data fetch
    fetchWeather();
    // Set up interval to refresh weather data every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);

    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(interval);
  }, [location]);

  // Loading state UI
  if (loading) {
    return <div className="weather-widget loading">Loading weather data...</div>;
  }

  // Error state UI
  if (error) {
    return <div className="weather-widget error">{error}</div>;
  }

  // Return null if no weather data is available
  if (!weather) {
    return null;
  }

  // Main weather widget UI
  return (
    <div className="weather-widget">
      {/* Weather header with location and weather icon */}
      <div className="weather-header">
        <h3>{weather.location}</h3>
        <img 
          src={`https:${weather.icon}`} 
          alt={weather.description}
          className="weather-icon"
        />
      </div>
      
      {/* Weather information section */}
      <div className="weather-info">
        {/* Temperature display */}
        <div className="temperature">
          <span className="current">{Math.round(weather.temperature)}°C</span>
          <span className="feels-like">Feels like: {Math.round(weather.feelsLike)}°C</span>
        </div>
        
        {/* Detailed weather information */}
        <div className="details">
          <div className="detail-item">
            <span className="label">Description:</span>
            <span className="value">{weather.description}</span>
          </div>
          <div className="detail-item">
            <span className="label">Humidity:</span>
            <span className="value">{weather.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="label">Wind Speed:</span>
            <span className="value">{weather.windSpeed} km/h</span>
          </div>
        </div>
        
        {/* Last updated timestamp */}
        <div className="last-updated">
          Last updated: {new Date(weather.lastUpdated).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
