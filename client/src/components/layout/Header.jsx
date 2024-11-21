import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout,loggedUser } = useAuth();

  return (
    <div className=" flex justify-between p-5 text-xl text-center sm:text-left font-semibold shadow-md">
      <Link to="/">Role Based User Management App</Link>
      {user?.token && (
        <button
          onClick={logout}
          className="border border-red-100 text-normal px-2 p-1 hover:bg-red-400 hover:text-white rounded-lg"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Header;
