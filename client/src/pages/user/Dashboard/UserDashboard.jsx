import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { message } from "antd";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const userLoggedIn = localStorage.getItem("token");

  const logoutUser = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  // useEffect(() => {
  //   if (!userLoggedIn) {
  //     navigate("/");
  //   }
  // }, userLoggedIn);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Sending a GET request with Authorization header containing JWT token
          const response = await axios.get("http://localhost:5000/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data); // Update user data
        } catch (error) {
          console.log(
            "Error fetching user data:",
            error.response?.data || error
          );
        }
      } else {
        console.log("No token found");
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (!userLoggedIn) {
      message.error("User not found");
      // logoutUser();
      // navigate("/");
    }
  }, [user]);

  const role = user?.is_admin ? "Admin" : "User";

  return (
    <div className="dot-bg min-h-screen flex flex-col pt-36 items-center">
      <div className=" rounded-xl bg-indigo-100 shadow-xl p-8 max-w-md w-full">
        <h1>Name : {user?.name}</h1>
        <h1>Email : {user?.email}</h1>
        <h1>Role : {role}</h1>
        <button onClick={logoutUser} className="bg-red-400 w-full py-3 ">
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
