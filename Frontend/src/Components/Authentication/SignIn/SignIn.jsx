import React from "react";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext";
import "./SignIn.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
<<<<<<< Updated upstream
=======
  const [error, setError] = useState(""); // Add error state
>>>>>>> Stashed changes
  const navigate = useNavigate();
  const handleNavigation = (path) => navigate(path);
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< Updated upstream
=======
    setError(""); // Clear previous error
>>>>>>> Stashed changes
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

      window.location.href = "/profile";
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    }
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
          <button type="submit">Login</button>
          <p className="CreateNew" onClick={() => handleNavigation("/signup")}>
            Create a new Account
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
