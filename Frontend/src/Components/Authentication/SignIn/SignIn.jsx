import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext";
import "./SignIn.css";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const navigate = useNavigate();
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
      if (!token) throw new Error("No token received from server");

      localStorage.setItem("token", token);
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

  // Google login success handler
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;

    try {
      const response = await axios.post(
        "http://localhost:5030/api/Auth/google", // Your backend endpoint
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
      const profileRes = await axios.get(
        "http://localhost:5030/api/profile/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userProfile = {
        ...decodedToken,
        ...profileRes.data,
      };
      setUser(userProfile);
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      window.location.href = "/";
    } catch (profileError) {
      console.error("Profile fetch error:", profileError);
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUser(decodedToken);
      window.location.href = "/";
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
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div style={{ marginTop: "1rem" }}>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setError("Google login failed")}
            />
          </div>

          <p className="CreateNew" onClick={() => setShowSignInModal(true)}>
            Create a new Account
          </p>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>

      {showSignInModal && (
        <div className="signin-modal-overlay" onClick={() => setShowSignInModal(false)}>
          <div className="signin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Sign In As</h3>
            <div className="signin-options">
              <button className="signin-option-btn" onClick={() => handleSignInOption("user")}>
                Normal User
              </button>
              <button className="signin-option-btn" onClick={() => handleSignInOption("service")}>
                Service Provider
              </button>
            </div>
            <button className="close-modal-btn" onClick={() => setShowSignInModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
