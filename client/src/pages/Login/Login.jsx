import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.email.trim()) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      formErrors.password = "Password is required";
    }
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      setErrors({});
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/login",
          {
            email: formData.email,
            password: formData.password,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
          setSubmitMessage("Login successful!");
          console.log("Login successful!");
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.data.user));
          setFormData({ email: "", password: "" });
          // Optionally, redirect the user to a protected route
          // e.g., window.location.href = "/dashboard";
        }
      } catch (error) {
        setSubmitMessage(
          error.response?.data?.message || "Login failed. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="dot-bg pb-56 min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className=" rounded-xl shadow-xl p-3 bg-white max-w-md w-full space-y-8 py-6">
        <div>
          <h2 className="txt-gr mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                placeholder="Email address"
                required
                className="appearance-none rounded-md my-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="flex justify-center items-center">Not registered? <Link className="text-indigo-500 ml-1 hover:underline" to='/register'>Register!</Link> </div>

        </form>
        {submitMessage && (
          <div
            className={`mt-4 text-center ${
              submitMessage.includes("successful")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {submitMessage}
          </div>
        )}
      </div>
    </div>
  );
}
