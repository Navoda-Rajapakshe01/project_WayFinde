import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SignUp.css";

const Register = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole =
    queryParams.get("role") === "service" ? "ServiceProvider" : "NormalUser";

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    contactEmail: "",
    role: initialRole, // Set the initial role based on query parameter
    serviceType: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({ ...formData, [name]: value });

    // Clear any previous error
    if (name === "contactEmail") {
      setEmailError("");
    }
  };

  const handleEmailBlur = () => {
    if (formData.contactEmail && !validateEmail(formData.contactEmail)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // Email validation function using regex
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate email before submission
    if (!validateEmail(formData.contactEmail)) {
      setEmailError("Please enter a valid email address");
      return; // Prevent form submission
    }

    // Create a copy of the form data for the API request
    const apiData = { ...formData };

    // If user is not a service provider, send empty string for serviceType
    if (apiData.role !== "ServiceProvider") {
      apiData.serviceType = "";
    }

    try {
      // Log the data being sent to help debug
      console.log("Sending registration data:", apiData);

      const response = await axios.post(
        "http://localhost:5030/api/Auth/register",

        apiData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Registration response:", response.data);

      setSuccess("Registration successful! Redirecting to sign in...");
      setTimeout(() => {
        navigate("/signin");
      }, 1800);
    } catch (error) {
      console.error("Registration error:", error);

      // Enhanced error handling
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error("Error response data:", error.response.data);
        const errorMessage =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data?.message ||
              error.response.data?.title ||
              "Registration failed. Please check your information and try again.";

        setError(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        setError(
          "No response from server. Please check your connection and try again."
        );
      } else {
        // Something happened in setting up the request
        setError("Registration failed. Please try again later.");
      }
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-form-section">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2>Register</h2>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="contactEmail"
            placeholder="Email"
            value={formData.contactEmail}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            className={emailError ? "input-error" : ""}
            required
          />
          {emailError && <p className="field-error-message">{emailError}</p>}

          {/* Role selection */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="NormalUser">Normal User</option>
            <option value="TransportProvider">Transport Provider</option>
            <option value="AccommodationProvider">
              Accommodation Provider
            </option>
          </select>

          {/* Conditional service type dropdown */}
          {formData.role === "ServiceProvider" && (
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
            >
              <option value="">Select Service Type</option>
              <option value="TransportProvider">Transport Provider</option>
              <option value="AccommodationProvider">
                Accommodation Provider
              </option>
            </select>
          )}

          <button type="submit">Register</button>
          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
