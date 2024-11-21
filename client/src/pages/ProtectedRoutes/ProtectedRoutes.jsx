import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, redirectTo }) => {
  const { user } = useAuth();
  const location = useLocation();

  // if (!user?.token) {
  //   return <Navigate to={redirectTo} state={{ from: location }} replace />;
  // }

  return children;
};

export default ProtectedRoute;
