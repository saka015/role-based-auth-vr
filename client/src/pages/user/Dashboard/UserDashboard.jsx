import { useEffect, useState } from "react";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { message } from "antd";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { logout, loggedUser } = useAuth();

  useEffect(() => {
    if (!loggedUser) {
      message.error("You are not logged in.");
      navigate("/");
      return;
    }
  }, [loggedUser, navigate]);

  return (
    <div className="dot-bg min-h-screen flex flex-col pt-36 items-center">
      <div className=" sm:min-h-96 max-w-72 sm:min-w-96  rounded-xl bg-indigo-100 border border-indigo-400 shadow-xl p-3">
        <span
          className={`float-right max-w-20 px-1 rounded-lg border text-center font-semibold text-sm capitalize ${
            loggedUser?.role.permissions.delete !== true
              ? "bg-green-100 text-green-700 border-green-700"
              : "bg-red-100 text-red-700 border-red-700"
          }`}
        >
          {loggedUser?.role.name}
        </span>
        <div className=" h-96 w-88 ml-8 flex flex-col justify-center items-center">
          <h1 className="text-3xl flex flex-col text-center">
            Welcome{" "}
            <span className="text-indigo-600 text-xl sm:text-5xl font-semibold">
              {loggedUser?.name}!
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
