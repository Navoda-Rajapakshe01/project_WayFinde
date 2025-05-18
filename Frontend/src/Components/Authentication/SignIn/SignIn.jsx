import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Make the login request
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

      // Check if we have a token in the response
      const token = response.data.token;
      if (!token) {
        throw new Error("No token received from server");
      }

      // Store the token
      localStorage.setItem("token", token);

      try {
        // Decode the token and extract user info
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        
        // Fetch user profile with the token
        const profileRes = await axios.get(
          "http://localhost:5030/api/profile/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Combine token info with profile data
        const userProfile = {
          ...decodedToken,
          ...profileRes.data,
        };
        
        // Update context and local storage
        setUser(userProfile);
        localStorage.setItem("userProfile", JSON.stringify(userProfile));
        
        // Redirect to home page
        window.location.href = "/";
      } catch (profileError) {
        console.error("Error fetching profile:", profileError);
        // Even if profile fetch fails, we can still log in with basic token info
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUser(decodedToken);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        setError(error.response.data.message || "Invalid credentials");
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        setError("Error during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration option selection
  const handleSignInOption = (type) => {
    setShowSignInModal(false);
    // Navigate to signup with the role parameter
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