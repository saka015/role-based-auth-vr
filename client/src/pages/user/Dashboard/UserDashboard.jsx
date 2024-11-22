import { useEffect, useState } from "react";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { message } from "antd";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { logout, loggedUser } = useAuth();

  const userLoggedIn = localStorage.getItem("token");

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
    }
  }, [user]);


  useEffect(() => {
    if (!loggedUser) {
      message.warning("Please login to access this page.");
      navigate("/");
    }
  }, []);
  return (
    <div className="dot-bg min-h-screen flex flex-col pt-36 items-center">
      <div className="min-h-96 min-w-96  rounded-xl bg-indigo-100 border border-indigo-400 shadow-xl p-3">
        <span
          className={`float-right max-w-20 px-1 rounded-lg border text-center font-semibold text-sm capitalize ${
            user?.role === "user"
              ? "bg-green-100 text-green-700 border-green-700"
              : user?.role === "admin"
              ? "bg-red-100 text-red-700 border-red-700"
              : user?.role === "maintainer"
              ? "bg-blue-100 text-blue-700 border-blue-700"
              : ""
          }`}
        >
          {user?.role}
        </span>
        <div className=" h-96 w-88 ml-8 flex flex-col justify-center items-center">
          <h1 className="text-3xl flex flex-col text-center">
            Welcome{" "}
            <span className="text-indigo-600 text-5xl font-semibold">
              {user?.name}!
            </span>
          </h1>
        </div>
        {/* <h1>Email : {user?.email}</h1> */}
        {/* <button
          onClick={logoutUser}
          className="mt-36 bg-red-100 rounded-lg border text-center font-semibold text-sm capitalize text-red-700 border-red-700 w-full py-3 "
        >
          Logout
        </button> */}
      </div>
    </div>
  );
};

export default UserDashboard;
