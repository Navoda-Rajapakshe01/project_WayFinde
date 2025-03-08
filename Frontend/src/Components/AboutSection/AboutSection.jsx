import React from "react";
import {
  FaCar, // Icon for vehicle type
  FaUserFriends, // Icon for passengers
  FaGasPump, // Icon for fuel type
  FaCog, // Icon for transmission
  FaMapMarkerAlt, // Icon for location
  FaUser, // Icon for owner name
  FaCity, // Icon for owner city
} from "react-icons/fa";
import "./AboutSection.css";

const AboutSection = ({ vehicleDetails, ownerDetails }) => {
  return (
    <div className="about-section">
      {/* About Title */}
      <h1 className="about-title">About</h1>

      {/* Content Container */}
      <div className="about-content">
        {/* About This Vehicle Section (Left Side) */}
        <div className="vehicle-details">
          <h3>About This Vehicle</h3>
          <p>
            <FaCar className="icon" /> <strong>Type:</strong>{" "}
            {vehicleDetails.type}
          </p>
          <p>
            <FaUserFriends className="icon" /> <strong>Passengers:</strong>{" "}
            {vehicleDetails.passengers}
          </p>
          <p>
            <FaGasPump className="icon" /> <strong>Fuel Type:</strong>{" "}
            {vehicleDetails.fuelType}
          </p>
          <p>
            <FaCog className="icon" /> <strong>Transmission:</strong>{" "}
            {vehicleDetails.transmission}
          </p>
          <p>
            <FaMapMarkerAlt className="icon" /> <strong>Location:</strong>{" "}
            {vehicleDetails.location}
          </p>
        </div>

        {/* Owner Details Section (Right Side) */}
        <div className="owner-details">
          <h3>Owner Details</h3>
          <p>
            <FaUser className="icon" /> <strong>Name:</strong>{" "}
            {ownerDetails.name}
          </p>
          <p>
            <FaCity className="icon" /> <strong>City:</strong>{" "}
            {ownerDetails.city}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
