import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./ReserveNow.css";

const ReserveNow = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle "Reserve Now" button click
  const handleReserveNow = () => {
    navigate("/ReserveVehicle"); // Redirect to the Reserve Now Page
  };

  return (
    <div className="reserve-now">
      <h2>Reserve Now</h2>
      <p>Book this vehicle for your next trip!</p>
      <button className="reserve-button" onClick={handleReserveNow}>
        Reserve Now
      </button>
    </div>
  );
};

export default ReserveNow;
