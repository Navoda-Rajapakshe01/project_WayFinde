import React, { createContext, useState, useEffect,useContext } from "react";
import PropTypes from "prop-types";


// Create the context
export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
  loading: true,
});

// Hook for easier usage
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Get the token from localStorage
        const token = localStorage.getItem("token");

        // If no token exists, user is not logged in
        if (!token) {
          console.log("No authentication token found");
          setUser(null);
          setLoading(false);
          return;
        }

        // Make the request with the token in Authorization header
        const res = await fetch("http://localhost:5030/api/Auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const userData = await res.json();
          console.log("User profile loaded:", userData);
          setUser(userData);
        } else {
          // Handle different error status codes
          if (res.status === 401) {
            console.log("Authentication token expired or invalid");
            // Optionally clear the invalid token
            localStorage.removeItem("token");
          } else {
            console.error(`Profile fetch failed with status: ${res.status}`);
          }
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

  
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Call backend logout endpoint with token
        await fetch("http://localhost:5030/api/Auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }

    // Clear token and user state regardless of API success
    localStorage.removeItem("token");
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
