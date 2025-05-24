import React, { useEffect, useState } from 'react';
import './WeatherWidget.css';

function WeatherWidget({ city }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5030/weather/${city}`) // Updated backend URL to localhost:5030
      .then(res => res.json())  // Parse JSON once here
      .then(data => {
        setWeather(data);  // No need for JSON.parse
      })
      .catch(err => console.error("Weather API Error: ", err));
  }, [city]);

  return (
    <div className="weather-widget">
      <h2>{city} Weather</h2>
      {weather ? (
        <div>
          <p>🌡️ Temperature: {weather.current.temp_c}°C</p>
          <p>🌤️ Condition: {weather.current.condition.text}</p>
          <img src={weather.current.condition.icon} alt="Weather Icon" />
          <p>💨 Wind: {weather.current.wind_kph} kph</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default WeatherWidget;
