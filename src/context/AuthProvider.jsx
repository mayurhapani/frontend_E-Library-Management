import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import GlobalLoader from "../components/GlobalLoader";
import PropTypes from "prop-types";

// Set axios to always send credentials
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const checkLoginStatus = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${BASE_URL}/users/getUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data) {
          setUser(response.data.data);
          setIsLoggedIn(true);
          setUserName(response.data.data.name || "");
          setUserRole(response.data.data.role || "");
        } else {
          throw new Error("Invalid user data received");
        }
      } else {
        throw new Error("No token found");
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
      setUser(null);
      setUserName("");
      setUserRole("");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const login = async (email, password) => {
    try {
      console.log("Attempting login...");
      const response = await axios.post(`${BASE_URL}/users/login`, {
        email,
        password,
      });
      console.log("Login response:", response.data);
      if (response.data.success && response.data.data && response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        setIsLoggedIn(true);
        setUser(response.data.data.user);
        setUserName(response.data.data.user.name || "");
        setUserRole(response.data.data.user.role || "");
        await checkLoginStatus();
      } else {
        throw new Error("Invalid login response");
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Attempting logout...");
      await axios.get(`${BASE_URL}/users/logout`, { withCredentials: true });
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUser(null);
      setUserName("");
      setUserRole("");
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error.response ? error.response.data : error.message);
    } finally {
      // Ensure state is reset even if the logout request fails
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUser(null);
      setUserName("");
      setUserRole("");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userName,
        userRole,
        user,
        loading,
        setLoading,
        login,
        logout,
        checkLoginStatus,
      }}
    >
      {loading && <GlobalLoader />}
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
