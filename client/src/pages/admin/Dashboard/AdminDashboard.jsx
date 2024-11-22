import React, { useEffect, useState } from "react";
import DialogBox from "../../../components/UI/Dialog/DialogBox";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [allUserData, setAllUserData] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // Track the whole user object being edited
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingStatus, setEditingStatus] = useState(null); // New state for editing status
  const [editingRole, setEditingRole] = useState(null);
  const usersPerPage = 5;

  const { loggedUser } = useAuth();
  // console.log("onadmiin", loggedUser.email);

  const getAllUsers = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.get("http://localhost:5000/api/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      console.log("No token found");
    }
  };

  useEffect(() => {
    if (!loggedUser) {
      message.warning("Please login to access this page.");
      navigate("/");
    }

    if (loggedUser?.role === "user") {
      message.warning("You are not authorized to access this page.");
      navigate("/");
    }

    getAllUsers();
  }, []);

  // Pagination and Filtering
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = allUserData.slice(indexOfFirstUser, indexOfLastUser);

  const filteredUsers = currentUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const addUser = (newUser) => {
    setAllUserData([...allUserData, newUser]);
  };

  const handleDeleteUser = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(
            `http://localhost:5000/api/admin/deleteuser/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          getAllUsers();
          Swal.fire("Deleted!", "The user has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting user:", error.message);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete user. Please try again later.",
          });
        }
      }
    });
  };

  const handleEditClick = (user) => {
    setEditingUser(editingUser === user ? null : user);
    setEditingStatus(editingUser === user ? null : user.status); //Initialize status state
    setEditingRole(editingUser === user ? null : user.role); //Initialize role state
  };

  const handleSaveEdit = async (user) => {
    try {
      const token = localStorage.getItem("token");
      const updatedUser = { ...user, status: editingStatus, role: editingRole };
      await axios.put(
        `http://localhost:5000/api/admin/edituser/${user._id}`,
        { role: editingRole, status: editingStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      getAllUsers();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User updated successfully!",
      });
      setEditingUser(null); // Reset editing state
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update user. Please try again later.",
      });
    }
  };

  return (
    <div className="dot-bg min-h-screen p-6">
      <div className="bg-white p-4 px-10 rounded-xl shadow-lg">
        <div className="flex justify-between gap-6">
          <h1 className="mt-6 text-2xl font-semibold p-2">User Management</h1>

          {loggedUser?.role !== "admin" ? (
            <h1 className="mt-6 text-2xl font-semibold rounded-lg p-2 border bg-blue-300 capitalize text-blue-800 border-blue-800">
              {loggedUser?.role}
            </h1>
          ) : (
            <h1 className="mt-6 text-2xl font-semibold rounded-lg p-2 border bg-red-300 capitalize text-red-800 border-red-800">
              {loggedUser?.role}
            </h1>
          )}
        </div>
        <p className="text-gray-500">
          Manage your users and their account permissions here.
        </p>

        <div className="flex justify-between items-center mt-12">
          <h2 className="font-semibold text-xl flex justify-center items-center">
            All Users{" "}
            <span className="text-gray-400 ml-2">{allUserData.length}</span>
          </h2>
          <div className="right flex gap-4">
            <input
              type="text"
              name="search"
              placeholder="Search by name or email..."
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="bg-indigo-600 hover:bg-indigo-800 active:bg-indigo-400 text-white px-4 py-2 rounded-md">
              <DialogBox name="Add User" onAddUser={addUser} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-96">
          <table className="min-w-full mt-4">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Access</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="bg-gray-50">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    {editingUser === user ? (
                      <select
                        value={editingStatus || user.status} // Use editingStatus or default value
                        onChange={(e) => setEditingStatus(e.target.value)}
                        className="border rounded text-sm text-center py-1"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <span
                        className={`capitalize font-semibold ${
                          user.status === "active"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {user.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingUser === user ? (
                      <select
                        value={editingRole || user.role} //Use editingRole or default value
                        onChange={(e) => setEditingRole(e.target.value)}
                        className="border rounded text-sm text-center py-1"
                      >
                        <option value="user">User</option>
                        {loggedUser?.role === "admin" && (
                          <option value="admin">Admin</option>
                        )}
                        <option value="maintainer">Maintainer</option>
                      </select>
                    ) : (
                      <span
                        className={`w-12 px-1 rounded-lg border text-center font-semibold text-sm capitalize ${
                          user.role === "user"
                            ? "bg-green-100 text-green-700 border-green-700"
                            : user.role === "admin"
                            ? "bg-red-100 text-red-700 border-red-700"
                            : user.role === "maintainer"
                            ? "bg-blue-100 text-blue-700 border-blue-700"
                            : ""
                        }`}
                      >
                        {user.role}
                      </span>
                    )}
                  </td>
                  {loggedUser?.email === user.email ? null : (
                    <td className="px-4 py-2">
                      {editingUser === user ? (
                        <>
                          <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2"
                            onClick={() => handleSaveEdit(user)}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-3 rounded"
                            onClick={() => handleEditClick(user)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </button>
                      )}
                      {loggedUser?.role === "admin" ? (
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded ml-2"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete
                        </button>
                      ) : null}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-indigo-200 cursor-pointer rounded-md"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </button>
          <span className="px-4 py-2">
            {currentPage} of {Math.ceil(allUserData.length / usersPerPage)}
          </span>
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-indigo-200 cursor-pointer rounded-md"
            disabled={
              currentPage === Math.ceil(allUserData.length / usersPerPage)
            }
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
