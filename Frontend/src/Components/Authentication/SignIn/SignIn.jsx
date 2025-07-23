import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React, { useContext, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../AuthContext/AuthContext";
import "./SignIn.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get("redirect");
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5030/api/Auth/login",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.token;
      const userId = response.data.userId;

      if (!token || !userId) throw new Error("Login response incomplete");

      // ✅ Save token and userId to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      // Check for admin credentials
      if (formData.username === "admin" && token) {
        // Decode token to check role
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userRole =
          decodedToken.role ||
          decodedToken.Role ||
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];

        if (userRole === "Admin") {
          console.log("Admin login detected");
          setUser({
            ...decodedToken,
            isAdmin: true,
          });
          localStorage.setItem("isAdmin", "true");
          navigate("/admin");
          return;
        }
      }

      // Continue with normal user login flow
      await handleProfileFetch(token);
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        setError(error.response.data.message || "Invalid credentials");
      } else if (error.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("Error during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;

    try {
      const response = await axios.post(
        "http://localhost:5030/api/Auth/google",
        { token: googleToken },
        { headers: { "Content-Type": "application/json" } }
      );

      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      await handleProfileFetch(jwt);
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed. Please try again.");
    }
  };

  const handleProfileFetch = async (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      // Check if user is admin
      const userRole =
        decodedToken.role ||
        decodedToken.Role ||
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      if (userRole === "Admin") {
        setUser({
          ...decodedToken,
          isAdmin: true,
        });
        localStorage.setItem("isAdmin", "true");
        navigate("/admin");
        return;
      }

      // Continue with normal user profile fetch

      // Auto-detect the role claim key
      const roleClaimKey = Object.keys(decodedToken).find((k) =>
        k.toLowerCase().includes("role")
      );
      const roleClaim = roleClaimKey ? decodedToken[roleClaimKey] : null;

      const profileRes = await axios.get(
        "http://localhost:5030/api/Auth/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userProfile = {
        ...decodedToken,
        ...profileRes.data,
        role: roleClaim,
      };

      setUser(userProfile);
      localStorage.setItem("userProfile", JSON.stringify(userProfile));

      if (roleClaim === "TransportProvider") {
        window.location.href = "/vehicle/supplier";
      } else if (roleClaim === "AccommodationProvider") {
        window.location.href = "/accommodation/supplier";
      } else {
        window.location.href = redirectPath || "/";
      }
    } catch (profileError) {
      console.error("Profile fetch error:", profileError);
      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      const roleClaimKey = Object.keys(decodedToken).find((k) =>
        k.toLowerCase().includes("role")
      );
      const roleClaim = roleClaimKey ? decodedToken[roleClaimKey] : null;

      setUser({ ...decodedToken, role: roleClaim });

      if (roleClaim === "TransportProvider") {
        window.location.href = "/vehicle/supplier";
      } else if (roleClaim === "AccommodationProvider") {
        window.location.href = "/accommodation/supplier";
      } else {
        window.location.href = redirectPath || "/";
      }
    }
  };

  const handleSignInOption = (type) => {
    setShowSignInModal(false);
    navigate(`/signup?role=${type}`);
  };

  return (
    <div className="login-page-container">
      <div className="login-form-section">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>
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
          {/* Add Forgot Password Link */}
          <div className="forgot-password-container-login">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {/* <div style={{ marginTop: "1rem" }}>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setError("Google login failed")}
            />
          </div> */}

          <p className="CreateNew" onClick={() => handleSignInOption("user")}>
            Create a new Account
          </p>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>

      {showSignInModal && (
        <div
          className="signin-modal-overlay"
          onClick={() => setShowSignInModal(false)}
        >
          <div className="signin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Sign In As</h3>
            <div className="signin-options">
              <button
                className="signin-option-btn"
                onClick={() => handleSignInOption("user")}
              >
                Normal User
              </button>
              <button
                className="signin-option-btn"
                onClick={() => handleSignInOption("service")}
              >
                Service Provider
              </button>
            </div>
            <button
              className="close-modal-btn"
              onClick={() => setShowSignInModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
