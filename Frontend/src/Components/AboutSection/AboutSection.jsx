import React from "react";
import {
  FaCar,
  FaUserFriends,
  FaGasPump,
  FaCog,
  FaMapMarkerAlt,
  FaUser,
  FaCity,
  FaBed,
  FaBath,
  FaHome,
  FaUsers,
} from "react-icons/fa";
import "./AboutSection.css";

const AboutSection = ({ details = {}, ownerDetails = {} }) => {
  const isVehicle = details?.transmission || details?.fuelType;

  return (
    <div className="about-section">
      <h1 className="about-title">About</h1>

      <div className="about-content">
        {/* Left Section */}
        <div className="vehicle-details">
          <h3>{`About This ${isVehicle ? "Vehicle" : "Accommodation"}`}</h3>

          {/* Common Fields */}
          {details.type && (
            <p>
              <FaCar className="icon" /> <strong>Type:</strong> {details.type}
            </p>
          )}
          {details.location && (
            <p>
              <FaMapMarkerAlt className="icon" /> <strong>Location:</strong>{" "}
              {details.location}
            </p>
          )}

          {/* Vehicle Fields */}
          {isVehicle && details.passengers && (
            <p>
              <FaUserFriends className="icon" /> <strong>Passengers:</strong>{" "}
              {details.passengers}
            </p>
          )}
          {isVehicle && details.fuelType && (
            <p>
              <FaGasPump className="icon" /> <strong>Fuel Type:</strong>{" "}
              {details.fuelType}
            </p>
          )}
          {isVehicle && details.transmission && (
            <p>
              <FaCog className="icon" /> <strong>Transmission:</strong>{" "}
              {details.transmission}
            </p>
          )}

          {/* Accommodation Fields */}
          {!isVehicle && details.guests && (
            <p>
              <FaUsers className="icon" /> <strong>Guests:</strong>{" "}
              {details.guests}
            </p>
          )}
          {!isVehicle && details.rooms && (
            <p>
              <FaHome className="icon" /> <strong>Bedrooms:</strong>{" "}
              {details.rooms}
            </p>
          )}
          {!isVehicle && details.beds && (
            <p>
              <FaBed className="icon" /> <strong>Beds:</strong> {details.beds}
            </p>
          )}
          {!isVehicle && details.bathRooms && (
            <p>
              <FaBath className="icon" /> <strong>Bathrooms:</strong>{" "}
              {details.bathRooms}
            </p>
          )}
        </div>

        {/* Right Section */}
        <div className="owner-details">
          <h3>Owner Details</h3>
          {ownerDetails.name && (
            <p>
              <FaUser className="icon" /> <strong>Name:</strong>{" "}
              {ownerDetails.name}
            </p>
          )}
          {ownerDetails.city && (
            <p>
              <FaCity className="icon" /> <strong>City:</strong>{" "}
              {ownerDetails.city}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
