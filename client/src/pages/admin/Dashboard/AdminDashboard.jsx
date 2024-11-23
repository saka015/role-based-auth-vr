import React, { useEffect, useState } from "react";
import DialogBox from "../../../components/UI/Dialog/DialogBox";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import DialogRole from "../../../components/UI/Dialog/DialogRole";
import UserManagement from "../components/UserManagement";
import RoleManagement from "../components/RoleManagement";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [showUsers, setShowUsers] = useState(true);
  const { loggedUser, statusAuth, accessAuth, editAuth, deleteAuth } =
    useAuth();

  useEffect(() => {
    if (!loggedUser) {
      message.warning("Please login to access this page.");
      navigate("/");
    }

    if (!(accessAuth || editAuth || deleteAuth)) {
      message.warning("You are not authorized to access this page.");
      navigate("/");
    }
  }, []);

  const handleShowUsers = () => setShowUsers(true);
  const handleShowRoles = () => setShowUsers(false);

  return (
    <div className="dot-bg min-h-screen p-6">
      <div className="bg-white flex gap-3 w-full rounded shadow-xl ">
        <button
          onClick={handleShowUsers}
          className={` ${
            !showUsers && "bg-indigo-100"
          }  text-xl rounded p-4 text-indigo-800 font-semibold  flex-1`}
        >
          Manage Users
        </button>
        <button
          onClick={handleShowRoles}
          className={` ${
            showUsers && "bg-indigo-100"
          }  text-xl rounded p-4 text-indigo-800 font-semibold  flex-1`}
        >
          Manage Role
        </button>
      </div>

      {showUsers ? <UserManagement /> : <RoleManagement />}
    </div>
  );
};

export default AdminDashboard;
