import React, { useState, useEffect } from 'react';
import './WeatherWidget.css';

const WeatherWidget = ({ location = "Galle" }) => {
    
    return (
        <div className="weather-image-card">
        <img
          src="https://via.placeholder.com/300x200" 
          alt="Weather"
          className="dashboard-image"
        />
        <div className="image-info">
          <h3>Sunny</h3>
          <p>28°C</p>
        </div>
      </div>
    );
  };
export default WeatherWidget;