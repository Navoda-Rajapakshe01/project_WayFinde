import axios from "axios";
import { useState } from "react";
import "../SignUp/SignUp.css";
const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://localhost:7138/api/Auth/register",
        formData
      );
      
      console.log(response.data); // 👈 See the full response
      alert("User registered successfully!");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        alert(error.response.data);  // Show backend BadRequest message
      } else {
        alert("Error registering user");
      }
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="register-form">
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
  );
};

export default Register;
