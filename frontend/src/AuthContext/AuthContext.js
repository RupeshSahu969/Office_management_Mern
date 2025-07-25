// AuthContext.js
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [email, setEmail] = useState(() => localStorage.getItem("email") || null);
  const [username, setUsername] = useState(() => localStorage.getItem("username") || null);
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);
  const [id, setId] = useState(() => localStorage.getItem("id") || null);

  const login = (token, email, username, role, id) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    localStorage.setItem("id", id);

    setToken(token);
    setEmail(email);
    setUsername(username);
    setRole(role);
    setId(id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("id");

    setToken(null);
    setEmail(null);
    setUsername(null);
    setRole(null);
    setId(null);
  };

  return (
    <AuthContext.Provider value={{ token, email, username, role, id, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
