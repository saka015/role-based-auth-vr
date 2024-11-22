// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import { Link } from "react-router-dom";
// // import { message } from "antd";
// // import { useAuth } from "../../context/AuthContext";

// // export default function Register() {
// //   const navigate = useNavigate();
// //   const { isLoggedIn } = useAuth();
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //     image: "",
// //   });
// //   const [errors, setErrors] = useState({});
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   useEffect(() => {
// //     if (isLoggedIn) {
// //       navigate("/about");
// //     }
// //   }, [isLoggedIn]);

// //   const handleChange = (e) => {
// //     const { name, value, type, files } = e.target;
// //     setFormData((prevData) => ({
// //       ...prevData,
// //       [name]: type === "file" ? files[0] : value,
// //     }));
// //   };

// //   const validateForm = () => {
// //     let formErrors = {};
// //     if (!formData.name.trim()) formErrors.name = "Name is required";
// //     if (!formData.email.trim()) formErrors.email = "Email is required";
// //     if (!formData.password) formErrors.password = "Password is required";
// //     if (!formData.image) formErrors.image = "Image is required";
// //     return formErrors;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const formErrors = validateForm();
// //     if (Object.keys(formErrors).length === 0) {
// //       setIsSubmitting(true);
// //       setErrors({});
// //       try {
// //         const formDataObj = new FormData();
// //         formDataObj.append("name", formData.name);
// //         formDataObj.append("email", formData.email);
// //         formDataObj.append("password", formData.password);
// //         formDataObj.append("image", formData.image);

// //         const response = await axios.post(
// //           "http://localhost:5000/api/users/register",
// //           formDataObj,
// //           { headers: { "Content-Type": "multipart/form-data" } }
// //         );

// //         if (response.status === 201) {
// //           message.success("User registered successfully!");
// //           setFormData({ name: "", email: "", password: "", image: null });

// //           const key = "redirecting";
// //           message.loading({ content: "Redirecting to login...", key });

// //           setTimeout(() => {
// //             message.success({ content: "Redirecting to login...", key });
// //             navigate("/login");
// //           }, 2000);
// //         }
// //       } catch (error) {
// //         message.error(error.response?.data?.message);
// //       } finally {
// //         setIsSubmitting(false);
// //       }
// //     } else {
// //       setErrors(formErrors);
// //     }
// //   };

// //   return (
// //     <div className="dot-bg min-h-screen pb-44 bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
// //       <div className="bg-white rounded-xl shadow-xl px-4 py-6 max-w-md w-full space-y-8">
// //         <div>
// //           <h2 className="txt-gr mt-6 text-center text-3xl font-extrabold text-gray-900">
// //             Create your account
// //           </h2>
// //         </div>
// //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
// //           <div className="rounded-md shadow-sm -space-y-px">
// //             <div>
// //               <input
// //                 id="name"
// //                 name="name"
// //                 type="text"
// //                 placeholder="Name"
// //                 required
// //                 className="appearance-none rounded-md my-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
// //                 value={formData.name}
// //                 onChange={handleChange}
// //               />
// //               {errors.name && (
// //                 <p className="mt-2 text-sm text-red-600">{errors.name}</p>
// //               )}
// //             </div>
// //             <div>
// //               <input
// //                 id="email-address"
// //                 name="email"
// //                 type="email"
// //                 placeholder="Email address"
// //                 required
// //                 className="appearance-none rounded-md my-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //               />
// //               {errors.email && (
// //                 <p className="mt-2 text-sm text-red-600">{errors.email}</p>
// //               )}
// //             </div>
// //             <div>
// //               <input
// //                 id="password"
// //                 name="password"
// //                 type="password"
// //                 placeholder="Password"
// //                 required
// //                 className="appearance-none rounded-md my-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
// //                 value={formData.password}
// //                 onChange={handleChange}
// //               />
// //               {errors.password && (
// //                 <p className="mt-2 text-sm text-red-600">{errors.password}</p>
// //               )}
// //             </div>
// //             <div>
// //               <input
// //                 id="image"
// //                 name="image"
// //                 type="file"
// //                 accept="image/*"
// //                 required
// //                 className="appearance-none rounded-md my-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
// //                 onChange={handleChange}
// //               />
// //               {errors.image && (
// //                 <p className="mt-2 text-sm text-red-600">{errors.image}</p>
// //               )}
// //             </div>
// //           </div>
// //           <div>
// //             <button
// //               type="submit"
// //               disabled={isSubmitting}
// //               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
// //             >
// //               {isSubmitting ? "Registering..." : "Register"}
// //             </button>
// //           </div>
// //           <div className="flex justify-center items-center">
// //             Already registered?{" "}
// //             <Link className="text-indigo-500 ml-1 hover:underline" to="/login">
// //               Login!
// //             </Link>{" "}
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // new

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { message } from "antd";

// export default function Register() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     image: null,
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "file" ? files[0] : value,
//     }));
//   };

//   const validateForm = () => {
//     let formErrors = {};
//     if (!formData.name.trim()) formErrors.name = "Name is required";
//     if (!formData.email.trim()) formErrors.email = "Email is required";
//     if (!formData.password) formErrors.password = "Password is required";
//     if (!formData.image) formErrors.image = "Image is required";
//     return formErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length === 0) {
//       setIsSubmitting(true);
//       setErrors({});
//       try {
//         const formDataObj = new FormData();
//         formDataObj.append("name", formData.name);
//         formDataObj.append("email", formData.email);
//         formDataObj.append("password", formData.password);
//         formDataObj.append("image", formData.image);

//         await axios.post("http://localhost:5000/api/register", formDataObj, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });

//         message.success("User registered successfully!");
//         setFormData({ name: "", email: "", password: "", image: null });
//         console.log(formData);
//         navigate("/login");
//       } catch (error) {
//         message.error(error.response?.data?.message);
//       } finally {
//         setIsSubmitting(false);
//       }
//     } else {
//       setErrors(formErrors);
//     }
//   };

//   return (
//     <div className="dot-bg min-h-screen pb-44 bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="bg-white rounded-xl shadow-xl px-4 py-6 max-w-md w-full space-y-8">
//         <h2 className="txt-gr mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Create your account
//         </h2>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 placeholder="Name"
//                 required
//                 className="appearance-none rounded-md my-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//               {errors.name && (
//                 <p className="mt-2 text-sm text-red-600">{errors.name}</p>
//               )}
//             </div>
//             <div>
//               <input
//                 id="email-address"
//                 name="email"
//                 type="email"
//                 placeholder="Email address"
//                 required
//                 className="appearance-none rounded-md my-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//               {errors.email && (
//                 <p className="mt-2 text-sm text-red-600">{errors.email}</p>
//               )}
//             </div>
//             <div>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 placeholder="Password"
//                 required
//                 className="appearance-none rounded-md my-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//               {errors.password && (
//                 <p className="mt-2 text-sm text-red-600">{errors.password}</p>
//               )}
//             </div>
//             <div>
//               <input
//                 id="image"
//                 name="image"
//                 type="file"
//                 accept="image/*"
//                 required
//                 className="appearance-none rounded-md my-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 onChange={handleChange}
//               />
//               {errors.image && (
//                 <p className="mt-2 text-sm text-red-600">{errors.image}</p>
//               )}
//             </div>
//           </div>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//           >
//             {isSubmitting ? "Registering..." : "Register"}
//           </button>
//           <div className="flex justify-center items-center">
//             Already registered?{" "}
//             <Link className="text-indigo-500 ml-1 hover:underline" to="/login">
//               Login!
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { message } from "antd";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.name.trim()) formErrors.name = "Name is required";
    if (!formData.email.trim()) formErrors.email = "Email is required";
    if (!formData.password) formErrors.password = "Password is required";
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      setErrors({});
      try {
        const formDataObj = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

        await axios.post("http://localhost:5000/api/register", formDataObj, {
          headers: { "Content-Type": "application/json" },
        });

        message.success("User registered successfully!");
        setFormData({ name: "", email: "", password: "" });
        navigate("/login");
      } catch (error) {
        message.error(error.response?.data?.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="dot-bg min-h-screen pb-44 bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-xl px-4 py-6 max-w-md w-full space-y-8">
        <h2 className="txt-gr mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                required
                className="appearance-none rounded-md my-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                placeholder="Email address"
                required
                className="appearance-none rounded-md my-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                className="appearance-none rounded-md my-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
          <div className="flex justify-center items-center">
            Already registered?{" "}
            <Link className="text-indigo-500 ml-1 hover:underline" to="/login">
              Login!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
