// AuthContext.js
import { createContext } from "react";

// Create the context with default values
export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
  loading: true,
});
