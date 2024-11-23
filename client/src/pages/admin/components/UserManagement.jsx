import React, { useEffect, useState } from "react";
import DialogBox from "../../../components/UI/Dialog/DialogBox";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import DialogRole from "../../../components/UI/Dialog/DialogRole";

const UserManagement = () => {
  const navigate = useNavigate();
  const [allUserData, setAllUserData] = useState([]);
  const [allRoleData, setRoleData] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingStatus, setEditingStatus] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const { loggedUser, statusAuth, accessAuth, editAuth, deleteAuth, allRoles } =
    useAuth();

  const usersPerPage = 5;

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
    setRoleData(allRoles);
    getAllUsers();
  }, [loggedUser]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = allUserData.slice(indexOfFirstUser, indexOfLastUser);

  const filteredUsers = currentUsers.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery?.toLowerCase())
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
    setEditingStatus(editingUser === user ? null : user.status);
    setEditingRole(editingUser === user ? null : user.role?.name);
  };


   const handleSaveEdit = async (user) => {
     try {
       const token = localStorage.getItem("token");
       const updatedUser = { ...user, status: editingStatus }; //editingRole removed because of backend
       const role = allRoleData.find((role) => role.name === editingRole);



       if (role) updatedUser.role = role._id;

       await axios.put(
         `http://localhost:5000/api/admin/edituser/${user._id}`,
         updatedUser,
         { headers: { Authorization: `Bearer ${token}` } }
       );
       getAllUsers();
       Swal.fire({
         icon: "success",
         title: "Success",
         text: "User updated successfully!",
       });
       setEditingUser(null);
     } catch (error) {
       console.error("Error updating user:", error);
       message.error("Failed to update user. Please try again later.");
     }
   };

  return (
    <div className="bg-white p-4 px-10 rounded shadow-lg">
      <div className="flex justify-between gap-6">
        <h1 className="mt-6 text-2xl font-semibold p-2">User Management</h1>
        {loggedUser?.role.name !== "admin" ? (
          <h1 className="mt-6 text-sm sm:text-2xl font-semibold rounded-lg p-2 border bg-blue-300 capitalize text-blue-800 border-blue-800">
            {loggedUser?.role.name}
          </h1>
        ) : (
          <h1 className="mt-6 h-10 sm:full flex justify-center items-center text-sm sm:text-2xl font-semibold rounded-lg p-2 border bg-red-300 capitalize text-red-800 border-red-800">
            {loggedUser?.role.name}
          </h1>
        )}
      </div>
      <p className="text-gray-500">
        Manage your users and their account permissions here.
      </p>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-12">
        <div className="w-full items-start">
          <h2 className="font-semibold  w-full text-left text-xl flex  items-center">
            All Users{" "}
            <span className="text-gray-400 ml-2">{allUserData.length}</span>
          </h2>
        </div>
        <div className="right flex gap-4 mt-2">
          <input
            type="text"
            name="search"
            placeholder="Search by name or email..."
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="">
            <div className="flex gap-5">
              <DialogBox name="Add User" onAddUser={addUser} />
            </div>
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
              <th className="px-4 py-2 text-left">Role</th>
              {editAuth || deleteAuth ? (
                <th className="px-4 py-2 text-left border-b">Actions</th>
              ) : (
                <th></th>
              )}
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
                      value={editingStatus || user.status}
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
                      value={editingRole || (user.role ? user.role.name : "")}
                      onChange={(e) => setEditingRole(e.target.value)}
                      className="capitalize border rounded text-sm text-center py-1"
                    >
                      {allRoleData.map((role) => (
                        <option key={role._id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="w-12 px-1 rounded-lg border text-center font-semibold text-sm capitalize bg-green-400">
                      {user?.role?.name || "N/A"}
                    </span>
                  )}
                </td>
                {loggedUser?.email === user.email &&
                (editAuth || deleteAuth) ? (
                  <td className="text-red-400 uppercase pl-3 pt-1 font-semibold">
                    not authorised
                  </td>
                ) : (
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
                      editAuth && (
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </button>
                      )
                    )}
                    {deleteAuth && (
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded ml-2"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    )}
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
  );
};

export default UserManagement;
