import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { AuthContext } from "../AuthContext/AuthContext";
import axios from "axios";
import React from "react";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios instance with authentication
  const setupAuthenticatedAxios = (token) => {
    return axios.create({
      baseURL: 'http://localhost:5030',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  };

  // Function to fetch user profile from backend
  const fetchUserProfile = async (token) => {
    try {
      const api = setupAuthenticatedAxios(token);
      const response = await api.get('/api/Auth/profile');
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (token && typeof token === 'string' && token.trim() !== '') {
        try {
          // Validate token format
          if (token.split('.').length === 3) {
            // Decode token to get basic user info
            const decodedToken = jwtDecode(token);
            
            // Check if token is expired
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp && decodedToken.exp < currentTime) {
              console.warn("Token expired");
              localStorage.removeItem("token");
              setUser(null);
            } else {
              // Token is valid, fetch additional user data from profile endpoint
              const userProfile = await fetchUserProfile(token);
              
              if (userProfile) {
                // Combine token data with profile data
                setUser({
                  ...decodedToken,
                  ...userProfile
                });
              } else {
                // If profile fetch fails, just use token data
                setUser(decodedToken);
              }
            }
          } else {
            console.warn("Invalid token format");
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Error processing token:", error);
          localStorage.removeItem("token");
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  // Extended setUser function to handle profile updates
  const updateUser = async (userData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;
      
      const api = setupAuthenticatedAxios(token);
      
      // Call API to update user profile
      await api.put('/api/User/update', userData);
      
      // Update local state with new data
      setUser(prev => ({...prev, ...userData}));
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  };

  if (loading) {
    return <div>Loading authentication...</div>; // Optional loading indicator
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      updateUser, // Add the update function to context
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;