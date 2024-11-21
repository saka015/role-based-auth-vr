import React, { useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import DialogBox from "../../../components/UI/Dialog/DialogBox";
import Swal from "sweetalert2";
import axios from "axios";

const AdminDashboard = () => {
  const [allUserData, setAllUserData] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingId, seteditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const getAllUsers = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get("http://localhost:5000/api/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUserData(response.data);
        setUsers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      console.log("No token found");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleEditClick = (email) => {
    seteditingId(editingId === email ? null : email);
  };

  // const handleAccessChange = (email, newAccess) => {
  //   const updatedUsers = users.map((user) =>
  //     user.email === email ? { ...user, access: newAccess } : user
  //   );
  //   setUsers(updatedUsers);
  // };

  // Filtering happens AFTER slicing for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = allUserData.slice(indexOfFirstUser, indexOfLastUser); // Slice ALLUserData

  const filteredCurrentUsers = currentUsers.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const addUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setAllUserData((prevUsers) => [...prevUsers, newUser]); //added this
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
              headers: { Authorization: `Bearer ${token}` }, // Add authorization header
            }
          );
          getAllUsers();
          Swal.fire("Deleted!", "The user has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete user. Please try again later.",
          });
        }
      }
    });
  };

  const handleAccessChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/admin/edituser/${userId}`, //Correct URL
        { role: newRole }, // Send new role in the request body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        //Check successful update
        getAllUsers(); //Refresh user list after update
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User role updated successfully!",
        });
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update user role. Please try again later.",
      });
    }
  };

  return (
    <div className="dot-bg min-h-screen p-6">
      <div className="bg-white p-4 px-10 rounded-xl shadow-lg">
        <h1 className="pt-6 text-2xl font-semibold">User Management</h1>
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
                <th className="px-4 py-2 text-left">Date Added</th>
                <th className="px-4 py-2 text-left">Access</th>
                <th className="px-4 py-2 text-left float-right mr-28">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.email} className="bg-gray-50">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.date}</td>
                  <td className="px-4 py-2">
                    {editingId === user._id ? (
                      <select
                        className="border rounded text-sm text-center py-1"
                        value={user.role} // Use user.role
                        onChange={(e) =>
                          handleAccessChange(user._id, e.target.value)
                        }
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="maintainer">Maintainer</option>
                      </select>
                    ) : (
                      <span
                        className={`w-12 px-1 rounded-lg border font-semibold text-sm capitalize ${
                          user.role === "user"
                            ? "bg-green-100 text-green-700 border-green-700"
                            : "bg-red-100 text-red-700 border-red-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="flex float-right gap-3 px-4 py-2">
                    <button
                      className={`${
                        editingId !== user._id ? "bg-gray-200" : "bg-green-200"
                      } hover:bg-indigo-200 hover:text-indigo-700 text-gray-600 cursor-pointer py-2 px-6 rounded-sm`}
                      onClick={() => handleEditClick(user._id)}
                    >
                      {editingId === user._id ? "Save" : "Edit"}
                    </button>
                    <button
                      className="bg-red-200 hover:bg-red-300 hover:text-red-700 text-red-600 cursor-pointer py-2 px-6 rounded-sm"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
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
