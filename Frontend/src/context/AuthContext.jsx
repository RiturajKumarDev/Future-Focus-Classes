import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("learnx_token") || null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated user on app boot
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("learnx_token");
      if (storedToken) {
        try {
          const res = await api.get("auth/me");
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            logout();
          }
        } catch (err) {
          console.warn("Auth token invalid:", err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("auth/login", { email, password });
    if (res.success && res.token) {
      localStorage.setItem("learnx_token", res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || "Login failed");
  };

  const register = async (userData) => {
    const res = await api.post("auth/register", userData);
    if (res.success && res.token) {
      localStorage.setItem("learnx_token", res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || "Registration failed");
  };

  const logout = async () => {
    try {
      await api.post("auth/logout");
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem("learnx_token");
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.put("auth/profile", profileData);
    if (res.success && res.data) {
      setUser(res.data);
      return res.data;
    }
    throw new Error(res.message || "Failed to update profile");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        role: user?.role || "guest",
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
