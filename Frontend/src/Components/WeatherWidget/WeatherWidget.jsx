import React from 'react';
import './WeatherWidget.css';

function WeatherWidget() {
  return (
    <div className="weather-widget">
      <div className="weather-header">
        <div className="weather-icon">
          <i className="fas fa-sun"></i>
          <span className="temperature">29°</span>
        </div>
        <div className="location-info">
          <h2>Galle</h2>
          <p>05:00 · Monday 5 Sep, 23</p>
        </div>
      </div>
      
      <div className="weather-details">
        <div className="weather-row">
          <span>Humidity</span>
          <span>58% <i className="fas fa-tint"></i></span>
        </div>
        <div className="weather-row">
          <span>Cloudy</span>
          <span>35% <i className="fas fa-cloud"></i></span>
        </div>
        <div className="weather-row">
          <span>Wind</span>
          <span>34km/h <i className="fas fa-wind"></i></span>
        </div>
      </div>
    </div>
  );
}

export default WeatherWidget;