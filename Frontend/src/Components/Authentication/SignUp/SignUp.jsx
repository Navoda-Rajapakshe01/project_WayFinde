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
    email: "",
    role: initialRole,
    ServiceType: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("https://localhost:7138/api/Auth/register", formData);
      setSuccess("Registration successful! Redirecting to sign in...");
      setTimeout(() => {
        navigate("/signin");
      }, 1800);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
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
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Role selection */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="NormalUser">Normal User</option>
            <option value="ServiceProvider">Service Provider</option>
          </select>

          {/* Conditional service type dropdown */}
          {formData.role === "ServiceProvider" && (
            <select
              name="ServiceType"
              value={formData.ServiceType}
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
