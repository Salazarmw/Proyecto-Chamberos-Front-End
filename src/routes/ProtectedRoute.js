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

  // Permitir acceso a ciertas rutas aunque el perfil esté incompleto
  const allowedWhileIncomplete = ["/quotations", "/jobs"];
  if (
    !user.isProfileComplete &&
    location.pathname !== "/profile/edit" &&
    !allowedWhileIncomplete.includes(location.pathname)
  ) {
    return <Navigate to="/profile/edit" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
