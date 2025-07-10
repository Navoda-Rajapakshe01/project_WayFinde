import React from 'react';
import './DashboardMap.css';

function DashboardMap() {
  return (
    <div className="dashboard-map-container">
      <div className="dashboard-map">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=79.8164,6.9271,79.8612,6.9271&layer=mapnik"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
        ></iframe>
      </div>
    </div>
  );
}

export default DashboardMap;
