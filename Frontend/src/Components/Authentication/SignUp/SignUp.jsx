import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SignUp.css";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine initial role from query param; map "service" to "ServiceProvider"
  const queryParams = new URLSearchParams(location.search);
  const initialRole =
    queryParams.get("role") === "service" ? "ServiceProvider" : "NormalUser";

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    contactEmail: "",
    role: initialRole,
    serviceType: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "contactEmail") setEmailError("");
  };

  const validateEmail = (email) => {
    // Simple email regex validation
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleEmailBlur = () => {
    if (formData.contactEmail && !validateEmail(formData.contactEmail)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail(formData.contactEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Prepare API data: if role is NOT one of the providers, clear serviceType
    const apiData = { ...formData };
    if (
      ![
        "ServiceProvider",
        "TransportProvider",
        "AccommodationProvider",
      ].includes(apiData.role)
    ) {
      apiData.serviceType = "";
    }

    // You might want to normalize serviceType as well if needed
    // But your backend should decide on allowed values anyway

    try {
      console.log("Sending registration data:", apiData);
      const response = await axios.post(
        "http://localhost:5030/api/Auth/register",
        apiData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Registration response:", response.data);

      setSuccess("Registration successful! Redirecting to sign in...");
      setTimeout(() => {
        navigate("/signin");
      }, 1800);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        const errorMessage =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data?.message ||
              error.response.data?.title ||
              "Registration failed. Please check your information and try again.";
        setError(errorMessage);
      } else if (error.request) {
        setError(
          "No response from server. Please check your connection and try again."
        );
      } else {
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
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="NormalUser">Normal User</option>
            <option value="TransportProvider">Transport Provider</option>
            <option value="AccommodationProvider">
              Accommodation Provider
            </option>
            <option value="ServiceProvider">Service Provider</option>{" "}
            {/* Added this option */}
          </select>

          {/* Only show serviceType dropdown if role is exactly "ServiceProvider" */}
          {formData.role === "ServiceProvider" && (
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required>
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
