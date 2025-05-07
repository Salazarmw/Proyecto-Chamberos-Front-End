//src/routes/ProtectedRoute.js

import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the profile is incomplete and not in /profile/edit, redirect
  if (!user.isProfileComplete && location.pathname !== "/profile/edit") {
    return <Navigate to="/profile/edit" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
