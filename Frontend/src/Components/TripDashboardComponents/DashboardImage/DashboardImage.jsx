import React from 'react';
import './DashboardImage.css'; 

const DashboardImage = () => {
  return (
    <div className="dashboard-image-card">
      <img
        src="https://srilankatourplan.com/wp-content/uploads/2020/06/galle.jpg" 
        alt="Trip Location Image"
        className="dashboard-image"
      />
      <div className="image-info">
        <h3>Days</h3>
        <p>Location</p>
      </div>
    </div>
  );
};

export default DashboardImage;
