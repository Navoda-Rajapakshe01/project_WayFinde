import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./SignUp.css"; // Make sure your CSS matches the SignIn page

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate(); // Initialize navigate
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:7138/api/Auth/register", formData);
      alert("User registered successfully!");
      navigate("/profile");
      // Optionally redirect to sign in page
      // window.location.href = "/signin";
    } catch (error) {
      console.error(error);
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
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
