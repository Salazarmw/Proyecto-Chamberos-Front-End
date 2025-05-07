//src/routes/PublicRoute.js

import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    if (!user.isProfileComplete) {
      return <Navigate to="/profile/edit" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
