import axios from "axios";
import React, { useState } from "react";
import "../UserLogin/UserLogin.css";
const UserForm = () => {
  const [formData, setFormData] = useState({
    // id: "",
    fullName: "",
    email: "",
    age: "",
  });

  console.log("API URL:", import.meta.env.VITE_API_URL);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://localhost:7138/api/user",
        formData
      );

      if (response.status === 200 || response.status === 201) {
        setMessage("User added successfully.");
        setError("");
        setFormData({ fullName: "", email: "", age: "" });
      } else {
        setMessage("");
        setError("Failed to add user. Please try again.");
      }
    } catch (err) {
      console.error("Axios error:", err); // <-- This will give you the real cause!
      setMessage("");
      setError("An error occurred. Please check your connection.");
    }
  };

  return (
    <div className="registration_form">
      <form onSubmit={handleSubmit}>
        {/* <div>
          <label>ID: </label>
          <input
            type="number"
            name="id"
            value={formData.id}
            onChange={handleChange}
          />
        </div> */}

        <div>
          <label>Full Name: </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Age: </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UserForm;
