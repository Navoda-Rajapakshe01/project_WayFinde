import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  // Email validation function using regex
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setError("");
    setMessage("");

    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Make the API call with improved error handling
      const response = await axios.post(
        "http://localhost:5030/api/Auth/forgot-password",
        { email: email.trim() }, // Trim whitespace from email
        {
          headers: {
            "Content-Type": "application/json",
          },
          // Add timeout to prevent long waits if server is unresponsive
          timeout: 8000,
        }
      );

      // If we get here, the request was successful, which means the email exists
      console.log("Password reset response:", response.data);
      // Check if the response contains an error message about non-existent user
      if (
        response.data.message &&
        response.data.message.includes("doesn't exist")
      ) {
        setError("This email is not registered in our system.");
      } else {
        // Only show success if user exists and email was sent
        setMessage(
          "A password reset link has been sent to your email address."
        );
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Forgot password error:", error);

      if (error.response) {
        // Server responded with an error status code
        if (error.response.status === 404) {
          setError("This email is not registered in our system.");
        } else if (error.response.status === 500) {
          // Handle 500 Internal Server Error specifically
          setError(
            "The password reset service is currently unavailable. Please try again later or contact support."
          );
          console.error("Server error details:", error.response.data);
        } else if (
          error.response.data &&
          typeof error.response.data === "string"
        ) {
          setError(error.response.data);
        } else if (error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else if (error.code === "ECONNABORTED") {
        // Request timed out
        setError(
          "The server is taking too long to respond. Please try again later."
        );
      } else if (error.request) {
        // The request was made but no response was received
        setError(
          "No response from server. Please check your connection and try again."
        );
      } else {
        // Something happened in setting up the request
        setError(
          "An error occurred while sending the request. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Add a temporary contact support option while the backend is being fixed
  const renderSupportContact = () => {
    if (error && error.includes("currently unavailable")) {
      return (
        <p className="support-message">
          If you need immediate assistance, please contact our support team at{" "}
          <a href="mailto:support@wayfinde.com">support@wayfinde.com</a>
        </p>
      );
    }
    return null;
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form-section">
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <h2>Forgot Password</h2>

          {!emailSent ? (
            <>
              <p className="instruction-text">
                Enter your email address and we&apos;ll send you a link to reset your
                password.
              </p>

              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && <p className="field-error-message">{error}</p>}
                {renderSupportContact()}
              </div>

              <button type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : "Send Reset Link"}
              </button>
            </>
          ) : (
            <div className="success-container">
              <div className="success-icon">✓</div>
              <p className="success-message">{message}</p>
              <p className="email-sent-info">
                The reset link will expire in 10 minutes. Please check your
                email (including spam folder).
              </p>
            </div>
          )}

          <div className="return-signin">
            <Link to="/signin">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
