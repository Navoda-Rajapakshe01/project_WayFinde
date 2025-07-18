import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Create the context with default values
export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from backend on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5030/api/auth/profile", {
          credentials: "include", // Important: send cookies with request
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Logout function: clear user and optionally call backend logout API
  const logout = async () => {
    try {
      // Optional: call backend logout to clear cookie server-side
      await fetch("http://localhost:5030/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Error during logout:", err);
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
