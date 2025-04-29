import React from "react";
import { jwtDecode } from "jwt-decode"; // Changed import syntax for v4.x
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { AuthContext } from "../AuthContext/AuthContext"; // Import AuthContext

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Add validation to check if token exists and has the correct format
    if (token && typeof token === 'string' && token.trim() !== '') {
      try {
        // Token format validation (simple check for JWT structure with 3 parts)
        if (token.split('.').length === 3) {
          const decodedToken = jwtDecode(token);
          setUser(decodedToken); // Set the user from the token
        } else {
          console.warn("Invalid token format detected");
          localStorage.removeItem("token"); // Remove the invalid token
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token"); // Remove the invalid token
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/"; // Redirect to the homepage
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Define PropTypes for AuthProvider
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;