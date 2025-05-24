import axios from "axios";
<<<<<<< Updated upstream
import { useState } from "react";
=======
import { useState, useContext } from "react";
import { AuthContext } from "../../Authentication/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
>>>>>>> Stashed changes
import "../UserLogin/UserLogin.css";

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
<<<<<<< Updated upstream
        "https://localhost:7138/api/user",
=======
        "http://localhost:5030/api/user",
        "http://localhost:5030/api/auth/login",
>>>>>>> Stashed changes
        formData
      );

      if (response.data.token) {
        await login(response.data);

        setMessage("Login successful! Redirecting...");

        const role = response.data.user.role;

        const redirectPath =
          role === "Admin"
            ? "/admin"
            : role === "VehicleSupplier"
            ? "/vehicle"
            : role === "AccommodationSupplier"
            ? "/accommodation"
            : "/";

        setTimeout(() => navigate(redirectPath), 1500);
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>User Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="login-links">
          <p>
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
          <p>
            Forgot password? <a href="/forgot-password">Reset it</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default UserLogin;
