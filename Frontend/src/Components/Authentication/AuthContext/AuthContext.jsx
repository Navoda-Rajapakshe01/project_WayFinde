// AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Use this after login to store user and update context
  const login = (userData) => {
    localStorage.setItem("userProfile", JSON.stringify(userData));
    localStorage.setItem("token", userData.token); // Optional: if you use auth token
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/"; // Or use navigate if you prefer SPA behavior
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
