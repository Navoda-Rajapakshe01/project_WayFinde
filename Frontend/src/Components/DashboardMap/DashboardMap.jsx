import React from 'react';
import './DashboardMap.css'; 

const DashboardMap = () => {
  return (
    <div className="dashboard-map-card">
      <img
        src="https://via.placeholder.com/300x200" 
        alt="Map Location"
        className="dashboard-map"
      />
      <div className="map-info">
        <h3>Map View</h3>
        <p>Location Coordinates</p>
      </div>
    </div>
  );
};

export default DashboardMap;
