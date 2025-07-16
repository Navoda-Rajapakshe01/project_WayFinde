// src/AuthContext/AuthProvider.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../AuthContext/AuthContext";
import axios from "axios";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setupAuthenticatedAxios = (token) => {
    return axios.create({
      baseURL: "http://localhost:5030",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const fetchUserProfile = async (token) => {
    try {
      const api = setupAuthenticatedAxios(token);
      const response = await api.get("/api/Auth/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (token && typeof token === "string" && token.trim() !== "") {
        try {
          if (token.split(".").length === 3) {
            const decodedToken = jwtDecode(token);

            const currentTime = Date.now() / 1000;
            if (decodedToken.exp && decodedToken.exp < currentTime) {
              console.warn("[AuthProvider] Token expired");
              localStorage.removeItem("token");
              setUser(null);
            } else {
              const userProfile = await fetchUserProfile(token);

              const roleClaim =
                decodedToken[
                  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ];
              const usernameClaim =
                decodedToken[
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                ];

              const normalizedUser = {
                ...decodedToken,
                ...userProfile, // Contains .id
                role: roleClaim,
                username: usernameClaim,
              };

              setUser(normalizedUser);
            }
          } else {
            console.warn("[AuthProvider] Invalid token format");
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("[AuthProvider] Error processing token:", error);
          localStorage.removeItem("token");
        }
      } else {
        console.log("[AuthProvider] No token found");
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

  const updateUser = async (userData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const api = setupAuthenticatedAxios(token);
      await api.put("/api/User/update", userData);

      setUser((prev) => ({ ...prev, ...userData }));
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        logout,
        isAuthenticated: !!user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
