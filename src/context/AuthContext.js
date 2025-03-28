import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("http://localhost:5000/api/auth/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error("Error checking auth:", error);
          setUser(null);
          localStorage.removeItem("token");
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const login = (response) => {
    // Guardamos el token
    localStorage.setItem("token", response.token);
    // Guardamos solo los datos del usuario
    setUser(response.user);
    navigate("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};