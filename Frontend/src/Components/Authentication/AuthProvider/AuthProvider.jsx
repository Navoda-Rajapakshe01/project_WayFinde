import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext/AuthContext";
//import { Spinner } from 'react-bootstrap';

// Add the useAuth hook that was missing
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setupAuthenticatedAxios = (token) => {
    return axios.create({
      baseURL: "http://localhost:5030", // Changed from https://localhost:7138
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
      // Improved error handling
      if (error.code === "ERR_NETWORK") {
        console.error("Network error - API server may be down or unreachable");
      } else if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error(
          `API error: ${error.response.status} - ${
            error.response.data?.message || "Unknown error"
          }`
        );
      } else {
        console.error("Error fetching user profile:", error);
      }
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      console.log("[AuthProvider] token from localStorage:", token);

      if (token && typeof token === "string" && token.trim() !== "") {
        try {
          if (token.split(".").length === 3) {
            const decodedToken = jwtDecode(token);
            console.log("[AuthProvider] Decoded token:", decodedToken);

            const currentTime = Date.now() / 1000;
            if (decodedToken.exp && decodedToken.exp < currentTime) {
              console.warn("[AuthProvider] Token expired");
              localStorage.removeItem("token");
              setUser(null);
            } else {
              const userProfile = await fetchUserProfile(token);
              console.log("[AuthProvider] User profile from API:", userProfile);

              // 🟢 Map claims to cleaner properties
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
                ...(userProfile || {}),
                role: roleClaim,
                username: usernameClaim,
              };

              console.log(
                "[AuthProvider] Normalized user object:",
                normalizedUser
              );

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
    localStorage.removeItem("userProfile");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
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
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {/* <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading authentication...</span>
        </Spinner> */}
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;