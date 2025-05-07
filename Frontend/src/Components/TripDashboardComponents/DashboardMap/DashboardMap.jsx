import React from 'react';
import './DashboardMap.css';

function DashboardMap() {
  return (
    <div className="dashboard-map-container">
      <div className="dashboard-map">
        {/* Placeholder for map - would use Google Maps or another map library in real app */}
        <div className="dashboard-map-controls">
          <button className="center-btn">
            <i className="fas fa-location-arrow"></i>
          </button>
          <div className="zoom-control-panel">
            <button className="zoom-in-btn">+</button>
            <button className="zoom-out-btn">−</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardMap;
