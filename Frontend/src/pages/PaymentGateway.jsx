import React from "react";
import "../pages/CSS/PaymentGateway.css";

const PaymentGateway = () => {
  // Handle "Book Now" button click
  const handleBookNow = () => {
    alert("Booking confirmed! Thank you for your reservation."); // Replace with actual booking logic
  };

  return (
    <div className="payment-gateway">
      <h2>Payment Gateway</h2>
      <p>This is a sandbox payment gateway for testing purposes.</p>
      <button className="book-button" onClick={handleBookNow}>
        Book Now
      </button>
    </div>
  );
};

export default PaymentGateway;
