import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherWidget.css';

const WeatherWidget = ({ location }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
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

    fetchWeather();
    // Refresh weather data every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [location]);

  if (loading) {
    return <div className="weather-widget loading">Loading weather data...</div>;
  }

  if (error) {
    return <div className="weather-widget error">{error}</div>;
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <h3>{weather.location}</h3>
        <img 
          src={`https:${weather.icon}`} 
          alt={weather.description}
          className="weather-icon"
        />
      </div>
      
      <div className="weather-info">
        <div className="temperature">
          <span className="current">{Math.round(weather.temperature)}°C</span>
          <span className="feels-like">Feels like: {Math.round(weather.feelsLike)}°C</span>
        </div>
        
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
        
        <div className="last-updated">
          Last updated: {new Date(weather.lastUpdated).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
