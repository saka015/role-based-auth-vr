// import Login from "./pages/Login/Login";
// import React from "react";
// import Register from "./pages/Register/Register";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import AppLayout from "./components/layout/AppLayout";
// import Home from "./pages/Home/Home";
// import AdminDashboard from "./pages/admin/Dashboard/AdminDashboard";
// import UserDashboard from "./pages/user/Dashboard/UserDashboard";
// import About from "./pages/Home/About";

// const App = () => {
//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <AppLayout />,
//       children: [
//         {
//           path: "/",
//           element:<Home/>
//       },
//         {
//           path: "/login",
//           element: <Login />,
//         },
//         {
//           path: "/register",
//           element: <Register />,
//         },
//         {
//           path: "/about",
//           element: <About />,
//         },
//         {
//           path: "/user/dashboard",
//           element: <UserDashboard />,
//         }
//         ,
//         {
//           path: "/admin/dashboard",
//           element: <AdminDashboard />,
//         },
//       ],
//     },
//   ]);

//   return <RouterProvider router={router} />;
// };

// export default App;

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoutes/ProtectedRoutes";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home/Home";
import AdminDashboard from "./pages/admin/Dashboard/AdminDashboard";
import UserDashboard from "./pages/user/Dashboard/UserDashboard";
import About from "./pages/Home/About";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { path: "/", element: <Home /> },
        {
          path: "/login",
          element: (
            <ProtectedRoute redirectTo="/user/dashboard">
              <Login />
            </ProtectedRoute>
          ),
        },
        {
          path: "/register",
          element: (
            <ProtectedRoute redirectTo="/user/dashboard">
              <Register />
            </ProtectedRoute>
          ),
        },
        { path: "/about", element: <About /> },
        { path: "/user/dashboard", element: <UserDashboard /> },
        { path: "/admin/dashboard", element: <AdminDashboard /> },
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
