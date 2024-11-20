import Login from "./pages/Login/Login";
import React from "react";
import Register from "./pages/Register/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home/Home";
import AdminDashboard from "./pages/admin/Dashboard/AdminDashboard";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element:<Home/>
      },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/admin/dashboard",
          element: <AdminDashboard />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
