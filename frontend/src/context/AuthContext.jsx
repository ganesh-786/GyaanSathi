import React, { createContext, useState, useEffect } from "react";
import { getProfile } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          // Verify token is still valid by fetching profile
          const response = await getProfile(storedToken);
          if (response.success) {
            setUser(response.data);
            setToken(storedToken);
          } else {
            // Token is invalid, clear storage
            logout();
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  // Helper functions for role checking
  const isAdmin = () => user?.role === "admin";
  const isManager = () => user?.role === "manager";
  const isUser = () => user?.role === "user";
  const canManageCourses = () => isAdmin() || isManager();

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAdmin,
    isManager,
    isUser,
    canManageCourses,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};