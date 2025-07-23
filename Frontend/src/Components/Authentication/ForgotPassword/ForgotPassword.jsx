import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validateEmail(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address",
      });
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5030/api/Auth/forgot-password",
        { email: email.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 8000,
        }
      );

      console.log("Password reset response:", response.data);

      if (
        response.data.message &&
        response.data.message.includes("doesn't exist")
      ) {
        Swal.fire({
          icon: "error",
          title: "Email Not Found",
          text: "This email is not registered in our system.",
        });
        setError("This email is not registered in our system.");
      } else {
        Swal.fire({
          icon: "success",
          title: "Email Sent!",
          text: "A password reset link has been sent to your email address.",
          timer: 3000,
          showConfirmButton: false,
        });
        setMessage(
          "A password reset link has been sent to your email address."
        );
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Forgot password error:", error);

      if (error.response) {
        if (error.response.status === 404) {
          setError("This email is not registered in our system.");
        } else if (error.response.status === 500) {
          Swal.fire({
            icon: "error",
            title: "Server Error",
            text: "The password reset service is currently unavailable. Please try again later or contact support.",
            footer: '<a href="mailto:support@wayfinde.com">Contact Support</a>',
          });
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
        setError(
          "The server is taking too long to respond. Please try again later."
        );
      } else if (error.request) {
        setError(
          "No response from server. Please check your connection and try again."
        );
      } else {
        setError(
          "An error occurred while sending the request. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="page-wrapper-forgot-password">
      <div className="forgot-password-container">
        <div className="forgot-password-form-section">
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <h2>Forgot Password</h2>

            {!emailSent ? (
              <>
                <p className="instruction-text">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </p>

                <div className="forgot-password-input-group">
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

            <div className="return-signin-forgot">
              <Link to="/signin">Back to Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
