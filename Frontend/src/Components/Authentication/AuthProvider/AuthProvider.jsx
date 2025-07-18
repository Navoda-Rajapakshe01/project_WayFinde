// src/AuthContext/AuthProvider.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../AuthContext/AuthContext";
import axios from "axios";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setupAuthenticatedAxios = (token) =>
    axios.create({
      baseURL: "http://localhost:5030", // Update if different
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

  const fetchUserProfile = async (token) => {
    try {
      const api = setupAuthenticatedAxios(token);
      const res = await api.get("/api/Auth/profile");
      return res.data;
    } catch (error) {
      console.error("[AuthProvider] Failed to fetch profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token || token.trim() === "") {
        console.warn("[AuthProvider] No valid token found");
        setLoading(false);
        return;
      }

      if (token.split(".").length !== 3) {
        console.warn("[AuthProvider] Invalid token format");
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        console.log("[AuthProvider] Decoded token:", decoded);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          console.warn("[AuthProvider] Token expired");
          localStorage.removeItem("token");
          setUser(null);
        } else {
          const roleClaimKey = Object.keys(decoded).find((k) =>
            k.toLowerCase().includes("role")
          );
          const role = roleClaimKey ? decoded[roleClaimKey] : "Guest";

          const username =
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ] ||
            decoded.username ||
            decoded.sub ||
            "Unknown";

          const profile = await fetchUserProfile(token);

          if (profile) {
            const mergedUser = {
              ...profile,
              token,
              role,
              username,
            };
            setUser(mergedUser);
          } else {
            localStorage.removeItem("token");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("[AuthProvider] Error decoding or fetching:", error);
        localStorage.removeItem("token");
        setUser(null);
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

  const updateUser = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const api = setupAuthenticatedAxios(token);
      await api.put("/api/User/update", updatedData);
      setUser((prev) => ({ ...prev, ...updatedData }));
      return true;
    } catch (error) {
      console.error("[AuthProvider] Error updating user:", error);
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
        logout,
        updateUser,
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
