import React, { useEffect, useState } from "react";
import DialogBox from "../../../components/UI/Dialog/DialogBox";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import DialogRole from "../../../components/UI/Dialog/DialogRole";

const RoleManagement = () => {
  const navigate = useNavigate();
  const [allRoleData, setRoleData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { loggedUser, statusAuth, accessAuth, editAuth, deleteAuth } =
    useAuth();

  const rolesPerPage = 5;

  const getAllRoles = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const allRoles = await axios.get(
          "http://localhost:5000/api/admin/getallroles",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRoleData(allRoles.data);
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

    getAllRoles();
  }, [loggedUser]);

  const indexOfLastUser = currentPage * rolesPerPage;
  const indexOfFirstUser = indexOfLastUser - rolesPerPage;
  const currentRoles = allRoleData.slice(indexOfFirstUser, indexOfLastUser);

  const filteredRoles = currentRoles.filter((role) =>
    role.name?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  // const filteredRoles = currentRoles.filter((role) =>
  //   role.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const addRole = (newRole) => {
    setRoleData([...allRoleData, newRole]);
  };

  const handleEditClick = (role) => {
    setEditingRole(editingRole === role ? null : role);
    // Set initial checkbox states based on role permissions
    setEditingPermissions({
      status: role.permissions.status,
      access: role.permissions.access,
      edit: role.permissions.edit,
      delete: role.permissions.delete,
    });
  };

  /*
 
     

     if its a editing role : then automaticlay check the boxes according to this logic :let status;
     let access;
     let edit;
     let deleteProp;

     if (status || edit) {
       access = true;
     }

     if (deleteProp) {
       access = true;
       status = true;
       edit = true;
     } , 
     
     if : any boxes are gettign changed then change others acocoridning to this logic :


     if : editingRole.access = DeletProp || edit || status || (changed value of access)
     if : editingRole.edit = DeletProp || (changed value of access)
     if : editingRole.status = DeletProp || (changed value of access)


    */

  const [editingRole, setEditingRole] = useState(null);
  const [editingPermissions, setEditingPermissions] = useState({
    status: false,
    access: false,
    edit: false,
    delete: false,
  });

  const handleSaveEditRole = async (role) => {
    console.log("role to update", role); //Log to confirm id.
    try {
      const token = localStorage.getItem("token");
      //Only send the permissions object, not the whole role object.
      await axios.put(
        `http://localhost:5000/api/admin/editrole/${role._id}`,
        { permissions: editingPermissions }, // Send only permissions
        { headers: { Authorization: `Bearer ${token}` } }
      );
      getAllRoles();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Role updated successfully!",
      });
      setEditingRole(null);
    } catch (error) {
      console.error("Error updating role:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update role. Please try again later.",
      });
    }
  };

  const handleDeleteRole = async (roleId) => {
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
            `http://localhost:5000/api/admin/deleterole/${roleId}`, // Use correct endpoint for roles
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          getAllRoles(); // Refresh the roles after deletion
          Swal.fire("Deleted!", "The role has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting role:", error.message);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete role. Please try again later.",
          });
        }
      }
    });
  };

  const [currentPermissions, setCurrentPermissions] = useState({
    status: false,
    access: false,
    edit: false,
    delete: false,
  });

  const updatePermissions = (permission, value, currentPermissions) => {
    setEditingPermissions({ ...editingPermissions, [permission]: value });

    //Enforce hierarchy (example):  Delete implies all other permissions.
    if (permission === "delete") {
      setEditingPermissions({
        status: value || currentPermissions.status,
        access: value || currentPermissions.access,
        edit: value || currentPermissions.edit,
        delete: value,
      });
      console.log("Updated value:", value);
      //   setAccess(false);

      return;
    } else if (permission === "edit") {
      setEditingPermissions({
        status: currentPermissions.status,
        access: value || currentPermissions.access,
        edit: currentPermissions.delete || value,
        delete: currentPermissions.delete,
      });
    } else if (permission === "status") {
      setEditingPermissions({
        status: currentPermissions.delete || value,
        access: value || currentPermissions.access,
        edit: currentPermissions.edit,
        delete: currentPermissions.delete,
      });
    } else {
      setEditingPermissions({
        status: currentPermissions.status,
        access:
          currentPermissions.delete ||
          currentPermissions.edit ||
          currentPermissions.status ||
          value,
        edit: currentPermissions.edit,
        delete: currentPermissions.delete,
      });
    }
  };

  useEffect(() => {
    setCurrentPermissions({
      status: editingPermissions.status,
      access: editingPermissions.access,
      edit: editingPermissions.edit,
      delete: editingPermissions.delete,
    });
  }, []);

return (
  <div className="bg-white p-4 px-10 rounded shadow-lg">
    <div className="flex justify-between gap-6">
      <h1 className="mt-6 text-2xl font-semibold p-2">Roles Management</h1>
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
    <p className="text-gray-500">Manage roles and their access.</p>

    <div className="flex flex-col sm:flex-row justify-between items-center mt-12">
      <div className="w-full items-start">
        <h2 className="font-semibold  w-full text-left text-xl flex  items-center">
          All Roles{" "}
          <span className="text-gray-400 ml-2">{allRoleData.length}</span>
        </h2>
      </div>
      <div className="mt-2 sm:mt-0 right flex gap-4">
        <input
          type="text"
          name="search"
          placeholder="Search by name or email..."
          className="border flex-1 border-gray-300 rounded-md px-4 py-0 sm:py-2 focus:outline-none focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex-1">
          <div className="flex gap-5">
            <DialogRole name="Add Role" onAddRole={addRole} />
          </div>
        </div>
      </div>
    </div>

    <div className="overflow-x-auto min-h-96">
      <table className="min-w-full mt-4 borde border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="px-4 py-2 text-left border-b">Name</th>
            <th className="px-4 py-2 text-left border-b">Status</th>
            <th className="px-4 py-2 text-left border-b">Access</th>
            <th className="px-4 py-2 text-left border-b">Edit</th>
            <th className="px-4 py-2 text-left border-b">Delete</th>

            {editAuth || deleteAuth ? (
              <th className="px-4 py-2 text-left border-b">Actions</th>
            ) : (
              <th></th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredRoles.map((role) => (
            <tr key={role._id} className="bg-gray-50">
              <td className="px-4 py-2 text-left border-b">{role.name}</td>
              <td className="px-4 py-2 text-left border-b">
                {editingRole === role ? (
                  <input
                    type="checkbox"
                    checked={editingPermissions.status}
                    onChange={(e) =>
                      updatePermissions(
                        "status",
                        e.target.checked,
                        editingPermissions
                      )
                    }
                    className="mr-2"
                  />
                ) : role.permissions.status ? (
                  "Yes"
                ) : (
                  "No"
                )}
              </td>
              <td className="px-4 py-2 text-left border-b">
                {editingRole === role ? (
                  <input
                    type="checkbox"
                    checked={editingPermissions.access}
                    onChange={(e) =>
                      updatePermissions(
                        "access",
                        e.target.checked,
                        editingPermissions
                      )
                    }
                    className="mr-2"
                  />
                ) : role.permissions.access ? (
                  "Yes"
                ) : (
                  "No"
                )}
              </td>
              <td className="px-4 py-2 text-left border-b">
                {editingRole === role ? (
                  <input
                    type="checkbox"
                    checked={editingPermissions.edit}
                    onChange={(e) =>
                      updatePermissions(
                        "edit",
                        e.target.checked,
                        editingPermissions
                      )
                    }
                    className="mr-2"
                  />
                ) : role.permissions.edit ? (
                  "Yes"
                ) : (
                  "No"
                )}
              </td>
              <td className="px-4 py-2 text-left border-b">
                {editingRole === role ? (
                  <input
                    type="checkbox"
                    checked={editingPermissions.delete}
                    onChange={(e) =>
                      updatePermissions(
                        "delete",
                        e.target.checked,
                        editingPermissions
                      )
                    }
                    className="mr-2"
                  />
                ) : role.permissions.delete ? (
                  "Yes"
                ) : (
                  "No"
                )}
              </td>
              <td className="px-4 py-2 text-left border-b">
                {editingRole === role ? (
                  <>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2"
                      onClick={() => handleSaveEditRole(role)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-3 rounded"
                      onClick={() => handleEditClick(role)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {editAuth && (
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
                        onClick={() => handleEditClick(role)}
                      >
                        Edit
                      </button>
                    )}
                    {deleteAuth && (
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mt-1 sm:mt-0"
                        onClick={() => handleDeleteRole(role._id)}
                      >
                        Delete
                      </button>
                    )}
                  </>
                )}
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
        {currentPage} of {Math.ceil(allRoleData.length / rolesPerPage)}
      </span>
      <button
        className="px-4 py-2 bg-gray-200 hover:bg-indigo-200 cursor-pointer rounded-md"
        disabled={currentPage === Math.ceil(allRoleData.length / rolesPerPage)}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  </div>
);
};

export default RoleManagement;
