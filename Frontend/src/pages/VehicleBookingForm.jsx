import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/CSS/VehicleBookingForm.css";

const VehicleBookingForm = () => {
  const navigate = useNavigate();

  // State for driver's details
  const [driverDetails, setDriverDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    licenseNumber: "",
  });

  // State for billing address
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Handle form input changes
  const handleDriverDetailsChange = (e) => {
    setDriverDetails({ ...driverDetails, [e.target.name]: e.target.value });
  };

  const handleBillingAddressChange = (e) => {
    setBillingAddress({ ...billingAddress, [e.target.name]: e.target.value });
  };

  // Handle "Next" button click
  const handleNext = () => {
    // Validate all fields
    if (
      !driverDetails.fullName ||
      !driverDetails.email ||
      !driverDetails.phone ||
      !driverDetails.licenseNumber ||
      !billingAddress.street ||
      !billingAddress.city ||
      !billingAddress.state ||
      !billingAddress.zipCode
    ) {
      alert("Please fill in all fields."); // Validation
      return;
    }
    navigate("/PaymentGateway"); // Redirect to the payment gateway page
  };

  return (
    <div className="booking-form">
      <h2>Booking Form</h2>

      {/* Driver's Details Section */}
      <div className="form-section">
        <h3>Driver's Details</h3>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={driverDetails.fullName}
          onChange={handleDriverDetailsChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={driverDetails.email}
          onChange={handleDriverDetailsChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={driverDetails.phone}
          onChange={handleDriverDetailsChange}
          required
        />
        <input
          type="text"
          name="licenseNumber"
          placeholder="Driver's License Number"
          value={driverDetails.licenseNumber}
          onChange={handleDriverDetailsChange}
          required
        />
      </div>

      {/* Billing Address Section */}
      <div className="form-section">
        <h3>Billing Address</h3>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={driverDetails.fullName}
          onChange={handleDriverDetailsChange}
          required
        />
        <input
          type="text"
          name="street"
          placeholder="Street Address"
          value={billingAddress.street}
          onChange={handleBillingAddressChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={billingAddress.city}
          onChange={handleBillingAddressChange}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={billingAddress.state}
          onChange={handleBillingAddressChange}
          required
        />
        <input
          type="text"
          name="zipCode"
          placeholder="Zip Code"
          value={billingAddress.zipCode}
          onChange={handleBillingAddressChange}
          required
        />
      </div>

      {/* Next Button */}
      <button className="next-button" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

export default VehicleBookingForm;
