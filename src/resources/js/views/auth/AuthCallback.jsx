import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const error = params.get("error");

        if (error) {
          throw new Error(error);
        }

        if (!token) {
          throw new Error("No token received");
        }

        // Obtener los datos del usuario usando el token
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        // Guardar el token en localStorage
        localStorage.setItem("token", token);
        // Actualizar el estado de autenticación
        login({ token, user: userData });
        if (userData.isProfileComplete === false) {
          navigate("/profile/edit");
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error during social login:", error);
        navigate("/login", {
          state: {
            error: error.message || "Failed to complete social login",
          },
        });
      }
    };

    handleCallback();
  }, [location, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Completing login...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}
