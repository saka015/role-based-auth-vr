import React, { createContext, useContext, useState, useEffect } from "react";
import { message } from "antd";
import axios from "axios"; // Import axios

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState(null);
  const [allRoles, setAllRoles] = useState([]);

  // fetching all users
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

  // fetching all roles
  const getAllRoles = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const allRoles = await axios.get(
          "http://localhost:5000/api/admin/getallroles",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAllRoles(allRoles.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      console.log("No token found");
    }
  };

  // permissions

  // console.log("loggedUser", loggedUser?.role.permissions.status);

  const statusAuth = loggedUser?.role.permissions.status;
  const accessAuth = loggedUser?.role.permissions.access;
  const editAuth = loggedUser?.role.permissions.edit;
  const deleteAuth = loggedUser?.role.permissions.delete;

  // console.log(statusAuth, accessAuth, editAuth, deleteAuth);

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

  useEffect(() => {
    fetchUserData();
    getAllRoles();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen min-w-screen flex justify-center items-start">
        <h1> Loading...</h1>
      </div>
    );
  }

  // if(loggedUser)

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loggedUser,
        statusAuth,
        accessAuth,
        editAuth,
        deleteAuth,
        allRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
