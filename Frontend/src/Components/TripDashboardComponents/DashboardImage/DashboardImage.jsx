import React from 'react';
import './DashboardImage.css'; 
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const DashboardImage = () => {
  return (
    <div className="dashboard-image-card">
      <img
        src="https://srilankatourplan.com/wp-content/uploads/2020/06/galle.jpg" 
        alt="Trip Location"
        className="dashboard-image"
      />
      <div className="overlay-info">
        <div className="info-item">
          <FaCalendarAlt className="icon" />
          <span>3 days</span>
        </div>
        <div className="info-item">
          <FaMapMarkerAlt className="icon" />
          <span>Galle, Colombo & Kandy </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardImage;
