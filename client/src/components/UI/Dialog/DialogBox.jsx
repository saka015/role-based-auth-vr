import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

const DialogBox = ({ name, onAddUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    access: "user",
  });
  const [allFilled, setAllFilled] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true); 

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "email") {
        validateEmail(value);
    }
  };

  const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  };

  const handleSubmit = () => {
    if (allFilled && isEmailValid) {
      onAddUser({
        ...formData,
        date: new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      });
      setFormData({ name: "", email: "", access: "user" });  
      setIsEmailValid(true);  
    }
  };

  useEffect(() => {
    const { name, email } = formData;
    setAllFilled(name.trim() !== "" && email.trim() !== "" && isEmailValid);
  }, [formData, isEmailValid]);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="">{name}</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
            {name}
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-mauve11">
            Create a new user
          </Dialog.Description>
          <fieldset className="mb-[15px] flex items-center gap-5">
            <label
              className="w-[90px] text-right text-[15px] text-violet11"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </fieldset>
          <fieldset className="mb-[15px] flex items-center gap-5">
            <label
              className="w-[90px] text-right text-[15px] text-violet11"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={`inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none ${
                isEmailValid
                  ? "text-violet11 shadow-violet7"
                  : "text-red-500 shadow-red-500"
              } shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]`}
              id="email"
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {!isEmailValid && (
              <span className="text-red-500 text-sm">Invalid email</span>
            )}
          </fieldset>
          <fieldset className="mb-[15px] flex items-center gap-5">
            <label
              className="w-[90px] text-right text-[15px] text-violet11"
              htmlFor="access"
            >
              Access
            </label>
            <select
              className="border px-3 p-1 bg-gray-100 text-center rounded-md"
              id="access"
              value={formData.access}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </fieldset>
          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button
                onClick={handleSubmit}
                className={`inline-flex h-[35px] items-center justify-center rounded bg-indigo-400 text-white px-[15px] font-medium leading-none ${
                  allFilled
                    ? "hover:bg-indigo-600"
                    : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!allFilled}
              >
                Save
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogBox;