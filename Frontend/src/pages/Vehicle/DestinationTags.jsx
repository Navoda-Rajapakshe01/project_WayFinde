import React from "react";
//import "../../../pages/CSS/Vehicle.css";

const DestinationTags = ({ destinations }) => (
  <section>
    <h2 className="vehicle-section-title">Popular Vehicle Pickup Locations</h2>
    <div className="vehicle-destination-tags">
      {destinations.map((place, index) => (
        <span key={index} className="vehicle-destination-tag">
          {place}
        </span>
      ))}
    </div>
  </section>
);

export default DestinationTags;
