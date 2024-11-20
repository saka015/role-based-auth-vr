import React, { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import DialogBox from "../../../components/UI/Dialog/DialogBox";
import { Alert,message } from "antd";
import Swal from "sweetalert2";

const usersData = [
  {
    name: "john doe",
    date: "4 June, 2024",
    email: "john.doe@gmail.com",
    access: "user",
  },
  {
    name: "jane doe",
    date: "5 June, 2024",
    email: "test@example.com",
    access: "admin",
  },
  {
    name: "mark smith",
    date: "6 June, 2024",
    email: "mark.smith@example.com",
    access: "manager",
  },
  {
    name: "lisa jones",
    date: "7 June, 2024",
    email: "lisa.jones@example.com",
    access: "user",
  },
  {
    name: "mike wilson",
    date: "8 June, 2024",
    email: "mike.wilson@example.com",
    access: "admin",
  },
  {
    name: "sarah brown",
    date: "9 June, 2024",
    email: "sarah.brown@example.com",
    access: "manager",
  },
  {
    name: "emma clark",
    date: "10 June, 2024",
    email: "emma.clark@example.com",
    access: "user",
  },
  {
    name: "paul lee",
    date: "11 June, 2024",
    email: "paul.lee@example.com",
    access: "admin",
  },
  {
    name: "anna scott",
    date: "12 June, 2024",
    email: "anna.scott@example.com",
    access: "manager",
  },
  {
    name: "david wright",
    date: "13 June, 2024",
    email: "david.wright@example.com",
    access: "user",
  },
];

const AdminDashboard = () => {
  const [users, setUsers] = useState(usersData);
  const [editingEmail, setEditingEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const handleEditClick = (email) => {
    setEditingEmail(editingEmail === email ? null : email);
  };

  const handleAccessChange = (email, newAccess) => {
    const updatedUsers = users.map((user) =>
      user.email === email ? { ...user, access: newAccess } : user
    );
    setUsers(updatedUsers);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const addUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

 const handleDeleteUser = (email) => {
   Swal.fire({
     title: "Are you sure?",
     text: "You won't be able to revert this!",
     icon: "warning",
     showCancelButton: true,
     confirmButtonColor: "#3085d6",
     cancelButtonColor: "#d33",
     confirmButtonText: "Yes, delete it!",
   }).then((result) => {
     if (result.isConfirmed) {
       // Perform delete action here
       setUsers((prevUsers) =>
         prevUsers.filter((user) => user.email !== email)
       );
       Swal.fire("Deleted!", "The user has been deleted.", "success");
     }
   });
 };

  return (
    <div className="dot-bg min-h-screen p-6">
      <div className="bg-white p-4 px-10 rounded-xl shadow-lg">
        <h1 className="pt-6 text-2xl font-semibold">User Management</h1>
        <p className="text-gray-500">
          Manage your users and their account permissions here.
        </p>

        <div className="flex justify-between items-center mt-12">
          <h2 className="font-semibold text-xl flex justify-center items-centerd">
            All Users{" "}
            <span className="text-gray-400 ml-2">{filteredUsers.length}</span>
          </h2>
          <div className="right flex gap-4">
            <div className="">
              <input
                type="text"
                name="search"
                placeholder="Search by name or email..."
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-800 active:bg-indigo-400 text-white px-4 py-2 rounded-md">
              <DialogBox name="Add User" onAddUser={addUser} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-96">
          <table className="min-w-full mt-4 ">
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
                    {editingEmail === user.email ? (
                      <select
                        className="border rounded text-sm text-center py-1"
                        value={user.access}
                        onChange={(e) =>
                          handleAccessChange(user.email, e.target.value)
                        }
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                      </select>
                    ) : (
                      <span
                        className={`w-12 px-1 rounded-lg border font-semibold text-sm capitalize ${
                          user.access === "user"
                            ? "bg-green-100 text-green-700 border-green-700"
                            : user.access === "admin"
                            ? "bg-red-100 text-red-700 border-red-700"
                            : "bg-blue-100 text-blue-700 border-blue-700"
                        }`}
                      >
                        {user.access}
                      </span>
                    )}
                  </td>
                  <td className="flex float-right gap-3 px-4 py-2">
                    <button
                      className={`${
                        editingEmail !== user.email
                          ? "bg-gray-200"
                          : "bg-green-200"
                      }  hover:bg-indigo-200 hover:text-indigo-700 text-gray-600 cursor-pointer py-2 px-6 rounded-sm`}
                      onClick={() => handleEditClick(user.email)}
                    >
                      {editingEmail === user.email ? "Save" : "Edit"}
                    </button>
                    <button
                      className="bg-red-200 hover:bg-red-300 hover:text-red-700 text-red-600 cursor-pointer py-2 px-6 rounded-sm"
                      onClick={() => handleDeleteUser(user.email)}
                    >
                      Delete User
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
            {currentPage} - {Math.ceil(filteredUsers.length / usersPerPage)}
          </span>

          <button
            className="px-4 py-2 bg-gray-200 hover:bg-indigo-200 cursor-pointer rounded-md"
            disabled={
              currentPage === Math.ceil(filteredUsers.length / usersPerPage)
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
