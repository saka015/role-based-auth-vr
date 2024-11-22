import React, { createContext, useContext, useState, useEffect } from "react";
import { message } from "antd";
import axios from "axios"; // Import axios

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setUser({ token: storedToken });

        try {
          const response = await axios.get("http://localhost:5000/api/user", {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setLoggedUser(response.data); // Update user data
        } catch (error) {
          console.error(
            "Error fetching user data:",
            error.response?.data || error
          );
          logout(); // Logout user if token is invalid
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser({ token });
    message.success("User logged in!");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setLoggedUser(null); // Clear user details
    message.info("User logged out!");
    window.location.href = "/";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen min-w-screen flex justify-center items-start">
        <h1> Loading...</h1>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loggedUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
