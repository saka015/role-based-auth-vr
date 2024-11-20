import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, redirectTo }) => {
  const { isLoggedIn } = useAuth();

  console.log(isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default ProtectedRoute;
