import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { logout, user } = useAuth();

  if (!user) {
    
  }

  return (
    <div className="min-h-screen w-full p-10">
      <div className="dot-bg shadow-2xl border pb-44 flex flex-col justify-center items-center rounded-2xl bg-white w-full min-h-[90vh] bg-transparent">
        <div>
          <h1 className="txt-gr text-center font-bold text-6xl text-indigo-500">
            Seamless Role-Based Access
          </h1>
        </div>
        <div className="flex gap-4 mt-8">
          {user?.token ? (
            <>
              <button
                onClick={logout}
                className="px-10 py-3 bg-red-600 shadow-xl transition-all rounded-lg text-white hover:bg-white border hover:text-indigo-600"
              >
                Logout
              </button>
              <Link to="/user/dashboard">
                <button className="px-10 py-3 bg-indigo-600 shadow-xl transition-all rounded-lg text-white hover:bg-white border hover:text-indigo-600">
                  User Dashboard
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="px-10 py-3 hover:bg-indigo-600 shadow-xl transition-all border bg-white rounded-lg hover:text-white text-indigo-600">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="px-10 py-3 bg-indigo-600 shadow-xl transition-all rounded-lg text-white hover:bg-white border hover:text-indigo-600">
                  Signup
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
