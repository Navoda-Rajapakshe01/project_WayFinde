<<<<<<< Updated upstream
// Import necessary modules
import { createContext } from "react";

// Create the AuthContext
export const AuthContext = createContext(); // Named export
=======
// AuthContext.js
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const login = (userData) => {
    setUser(userData.user);
    setRole(userData.user.role);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.user.role);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext as default };
>>>>>>> Stashed changes
