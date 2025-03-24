import React from 'react';
import './DashboardImage.css'; 

const DashboardImage = () => {
  return (
    <div className="dashboard-image-card">
      <img
        src="https://images.unsplash.com/photo-1579989197111-928f586796a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FsbGV8ZW58MHx8MHx8fDA%3D" 
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
