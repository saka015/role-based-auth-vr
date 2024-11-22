import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home/Home";
import AdminDashboard from "./pages/admin/Dashboard/AdminDashboard";
import UserDashboard from "./pages/user/Dashboard/UserDashboard";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { path: "/", element: <Home /> },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/user/dashboard",
          element: <UserDashboard />,
        },
        {
          path: "/admin/dashboard",
          element: <AdminDashboard />,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
