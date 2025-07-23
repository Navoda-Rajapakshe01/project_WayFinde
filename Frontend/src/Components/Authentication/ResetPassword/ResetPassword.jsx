import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [message, setMessage] = useState("");
  const [tokenChecked, setTokenChecked] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const navigate = useNavigate();

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        setMessage("Invalid or missing reset token.");
        setTokenChecked(true);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5030/api/Auth/validate-reset-token?token=${encodeURIComponent(
            token
          )}&email=${encodeURIComponent(email)}`
        );
        setIsTokenValid(true);
        setTokenChecked(true);
      } catch (error) {
        console.error("Token validation error:", error);
        setIsTokenValid(false);
        setMessage(
          error.response?.data?.message ||
            "This password reset link is invalid or has expired."
        );
        setTokenChecked(true);
      }
    };

    validateToken();
  }, [token]);

  const validatePassword = (password) => {
    // Require at least 8 characters with at least one number and one letter
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    // Validate password
    if (!validatePassword(password)) {
      setValidationError(
        "Password must be at least 8 characters long and include both letters and numbers."
      );
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5030/api/Auth/reset-password",
        {
          token: token,
          newPassword: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Your password has been reset successfully!");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      setValidationError(
        error.response?.data?.message ||
          "Failed to reset password. The link may have expired."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (!tokenChecked) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-form-section">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Validating reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isTokenValid) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-form-section">
          <div className="token-invalid">
            <div className="error-icon">!</div>
            <h2>Invalid Reset Link</h2>
            <p>{message}</p>
            <Link to="/forgot-password" className="request-new-link">
              Request a new password reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state (after password reset)
  if (message) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-form-section">
          <div className="success-container">
            <div className="success-icon">✓</div>
            <h2>Password Reset Complete</h2>
            <p>{message}</p>
            <p>Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  // Default: Form state
  return (
    <div className="reset-password-page-wrapper">
      <div className="reset-password-container">
        <div className="reset-password-form-section">
          <form onSubmit={handleSubmit} className="reset-password-form">
            <h2>Reset Password</h2>
            <p className="instruction-text">
              Please enter your new password below.
            </p>

            <div className="input-group-reset-password">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="input-group-reset-password">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            {validationError && (
              <p className="error-message">{validationError}</p>
            )}

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
