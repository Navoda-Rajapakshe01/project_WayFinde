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
  const [showSignInModal, setShowSignInModal] = useState(false); // 🛠️ Fixed: initialize modal state
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "https://localhost:7138/api/Auth/login",
        formData
      );

      const token = response.data.token;

      if (!token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("token", token);

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUser(decodedToken);

      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setError("Invalid credentials");
    }
  };

  // 🛠️ New function to handle modal sign-in option
  const handleSignInOption = (type) => {
    setShowSignInModal(false);
    navigate(`/signup?role=${type}`);
    if (type === "user") {
      navigate("/signup"); // Navigate to user registration
    } else if (type === "service") {
      navigate("/signup"); // You can differentiate routes if needed
    }
  };

  const openModal = () => setShowSignInModal(true);
  const closeModal = () => setShowSignInModal(false);

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
          <button type="submit">Login</button>
          <p className="CreateNew" onClick={openModal}>
            Create a new Account
          </p>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>

      {showSignInModal && (
        <div className="signin-modal-overlay" onClick={closeModal}>
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
            <button className="close-modal-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;