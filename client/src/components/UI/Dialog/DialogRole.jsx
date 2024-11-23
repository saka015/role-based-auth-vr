// import { useEffect, useState } from "react";
// import * as Dialog from "@radix-ui/react-dialog";
// import { Cross2Icon } from "@radix-ui/react-icons";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { useAuth } from "../../../context/AuthContext";

// const DialogRole = ({ name, onAddRole }) => {
//   const { loggedUser } = useAuth();

//   const [formData, setFormData] = useState({
//     name: "",
//     permissions: {
//       status: false,
//       access: false,
//       edit: false,
//       delete: false,
//     },
//   });

//   const handleChange = (e) => {
//     const { id, checked, value, type } = e.target;

//     if (type === "checkbox") {
//       setFormData((prev) => ({
//         ...prev,
//         permissions: { ...prev.permissions, [id]: checked },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [id]: value }));
//     }
//   };

//   const handleSubmit = async () => {
//     if (!formData.name) {
//       Swal.fire("Error", "Please fill in all fields correctly.", "error");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         "http://localhost:5000/api/admin/addrole",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       onAddRole(response.data.role);
//       Swal.fire("Success", "Role added successfully!", "success");
//       setFormData({
//         name: "",
//         permissions: {
//           status: false,
//           access: false,
//           edit: false,
//           delete: false,
//         },
//       });
//     } catch (error) {
//       console.error("Error creating role:", error);
//       Swal.fire(
//         "Error",
//         error.response?.data?.message || "Failed to add role. Try again later.",
//         "error"
//       );
//     }
//   };

//   const [currentPermissions, setCurrentPermissions] = useState({
//     status: false,
//     access: false,
//     edit: false,
//     delete: false,
//   });

//   const updatePermissions = (permission, value) => {
//     setCurrentPermissions((currentPermissions) => {
//       const updatedPermissions = { ...currentPermissions, [permission]: value };

//       // Enforce hierarchy: Delete implies all other permissions
//       if (permission === "delete") {
//         setEditingPermissions({
//           status: value || currentPermissions.status,
//           access: value || currentPermissions.access,
//           edit: value || currentPermissions.edit,
//           delete: value,
//         });
//         console.log("Updated value:", value);
//         setAccess(false);

//         return;
//       } else if (permission === "edit") {
//         setEditingPermissions({
//           status: currentPermissions.status,
//           access: value || currentPermissions.access,
//           edit: currentPermissions.delete || value,
//           delete: currentPermissions.delete,
//         });
//       } else if (permission === "status") {
//         setEditingPermissions({
//           status: currentPermissions.delete || value,
//           access: value || currentPermissions.access,
//           edit: currentPermissions.edit,
//           delete: currentPermissions.delete,
//         });
//       } else {
//         setEditingPermissions({
//           status: currentPermissions.status,
//           access:
//             currentPermissions.delete ||
//             currentPermissions.edit ||
//             currentPermissions.status ||
//             value,
//           edit: currentPermissions.edit,
//           delete: currentPermissions.delete,
//         });
//       }
//     }

//       return updatedPermissions;
//   };

//   useEffect(() => {
//     // This useEffect is now redundant because the state is updated directly in `updatePermissions`.
//   }, [currentPermissions]);

//   return (
//     <Dialog.Root>
//       <Dialog.Trigger asChild>
//         <button className="bg-indigo-600 hover:bg-indigo-800 active:bg-indigo-400 text-white px-4 py-2 rounded-md">
//           {name}
//         </button>
//       </Dialog.Trigger>
//       <Dialog.Portal>
//         <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
//         <Dialog.Content
//           className="z-100 fixed bg-indigo-100 p-6 rounded-lg shadow-lg w-[90%] max-w-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
//           onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
//         >
//           <Dialog.Title className="text-xl font-bold">Add Role</Dialog.Title>
//           <Dialog.Description className="text-gray-500">
//             Fill in the details to add a new role.
//           </Dialog.Description>
//           <form className="mt-4">
//             <div className="mb-4">
//               <label htmlFor="name" className="block text-lg font-medium">
//                 Role Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 placeholder="Enter role name"
//               />
//             </div>
//             <div className="mb-4">
//               {["status", "access", "edit", "delete"].map((perm) => (
//                 <div key={perm} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id={perm}
//                     checked={formData.permissions[perm]} //Use formData.permissions here
//                     onChange={(e) => updatePermissions(perm, e.target.checked)}
//                     className="mr-2"
//                   />
//                   <label className="ml-2 text-lg" htmlFor={perm}>
//                     {perm.charAt(0).toUpperCase() + perm.slice(1)}
//                   </label>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-end">
//               <Dialog.Close asChild>
//                 <button className="mr-2 px-4 py-2 bg-gray-300 rounded-md">
//                   Cancel
//                 </button>
//               </Dialog.Close>
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-md"
//               >
//                 Add Role
//               </button>
//             </div>
//           </form>
//           <Dialog.Close asChild>
//             <button
//               aria-label="Close"
//               className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
//             >
//               <Cross2Icon />
//             </button>
//           </Dialog.Close>
//         </Dialog.Content>
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// };

// export default DialogRole;

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";
import { message } from "antd";

const DialogRole = ({ name, onAddRole }) => {
  const { loggedUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    permissions: {
      status: false,
      access: false,
      edit: false,
      delete: false,
    },
  });

  const handleChange = (e) => {
    const { id, checked, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => {
        const updatedPermissions = { ...prev.permissions, [id]: checked };

        // Enforce hierarchy: Delete implies all other permissions
        if (id === "delete") {
          updatedPermissions.status = checked || prev.permissions.status;
          updatedPermissions.access = checked || prev.permissions.access;
          updatedPermissions.edit = checked || prev.permissions.edit;
        } else if (id === "edit") {
          updatedPermissions.access = checked || prev.permissions.access;
        } else if (id === "status") {
          updatedPermissions.access = checked || prev.permissions.access;
        } else if (id === "access") {
          // Access permission changed - update other based on Delete
          updatedPermissions.status =
            prev.permissions.delete || prev.permissions.status || checked;
          updatedPermissions.edit =
            prev.permissions.delete || prev.permissions.edit || checked;
        }
        return { ...prev, permissions: updatedPermissions };
      });
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      Swal.fire("Error", "Please fill in all fields correctly.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/admin/addrole",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      onAddRole(response.data.role);
      message.success("Role added successfully!");
      setFormData({
        name: "",
        permissions: {
          status: false,
          access: false,
          edit: false,
          delete: false,
        },
      });
    } catch (error) {
      console.error("Error creating role:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to add role. Try again later.",
        "error"
      );
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-indigo-600 hover:bg-indigo-800 active:bg-indigo-400 text-white px-4 py-2 rounded-md">
          {name}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
        <Dialog.Content
          className="z-100 fixed bg-indigo-100 p-6 rounded-lg shadow-lg w-[90%] max-w-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        >
          <Dialog.Title className="text-xl font-bold">Add Role</Dialog.Title>
          <Dialog.Description className="text-gray-500">
            Fill in the details to add a new role.
          </Dialog.Description>
          <form className="mt-4">
            <div className="mb-4">
              <label htmlFor="name" className="block text-lg font-medium">
                Role Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter role name"
              />
            </div>
            <div className="mb-4">
              {["status", "access", "edit", "delete"].map((perm) => (
                <div key={perm} className="flex items-center">
                  <input
                    type="checkbox"
                    id={perm}
                    checked={formData.permissions[perm]}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label className="ml-2 text-lg" htmlFor={perm}>
                    {perm.charAt(0).toUpperCase() + perm.slice(1)}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Dialog.Close asChild>
                <button className="mr-2 px-4 py-2 bg-gray-300 rounded-md">
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Add Role
                </button>
              </Dialog.Close>
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              aria-label="Close"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogRole;
