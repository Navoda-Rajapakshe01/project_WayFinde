import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext/AuthContext";
import "./SignIn.css"; // Import the CSS file for styling
const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { setUser } = useContext(AuthContext); // Use the AuthContext to update the user state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://localhost:7138/api/Auth/login",
        formData
      );

      const token = response.data.token;

      if (!token) {
        throw new Error("No token received from server");
      }

      // Save the token in localStorage
      localStorage.setItem("token", token);

      // Decode the token to get user information
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
      setUser(decodedToken); // Update the user state in the AuthContext

      alert("Login successful!");
      window.location.href = "/profile"; // Redirect to the profile page
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
