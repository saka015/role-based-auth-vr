import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";

const DialogBox = ({ name, onAddUser }) => {
  const { loggedUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "email") validateEmail(value);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !isEmailValid) {
      Swal.fire("Error", "Please fill in all fields correctly.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/admin/createuser",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      onAddUser(response.data);
      Swal.fire("Success", "User added successfully!", "success");
      setFormData({ name: "", email: "", role: "user" });
      window.location.reload();
    } catch (error) {
      console.error("Error creating user:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to add user. Try again later.",
        "error"
      );
    }
  };

  const handleDialogClose = () => {
    setFormData({ name: "", email: "", role: "user" });
    setIsEmailValid(true);
  };

  return (
    <Dialog.Root onOpenChange={handleDialogClose}>
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
          <Dialog.Title className="text-xl font-bold">Add User</Dialog.Title>
          <Dialog.Description className="text-gray-500">
            Fill in the details to add a new user.
          </Dialog.Description>
          <form className="mt-4">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border ${
                  isEmailValid ? "border-gray-300" : "border-red-500"
                } rounded-md p-2`}
                placeholder="Enter email"
              />
              {!isEmailValid && (
                <p className="text-red-500 text-sm">Invalid email address</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="user">User</option>
                {loggedUser.role === "admin" && (
                  <option value="admin">Admin</option>
                )}
                <option value="maintainer">Maintainer</option>
              </select>
            </div>
            <div className="flex justify-end">
              <Dialog.Close asChild>
                <button className="mr-2 px-4 py-2 bg-gray-300 rounded-md">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Add User
              </button>
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

export default DialogBox;
