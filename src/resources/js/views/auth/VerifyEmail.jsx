import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import InputError from "../components/InputError";
import PrimaryButton from "../components/PrimaryButton";
import GuestLayout from "../layouts/GuestLayout";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setError("No verification token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/verify-email",
          {
            token,
          }
        );
        setMessage(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Error verifying email");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <GuestLayout>
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Verificación de Correo Electrónico
        </h1>

        {loading ? (
          <div className="text-center">
            Verificando tu correo electrónico...
          </div>
        ) : message ? (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-md border border-green-200 dark:border-green-800">
            {message}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md border border-red-200 dark:border-red-800">
            {error}
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-end">
          <PrimaryButton onClick={() => navigate("/login")} className="ml-4">
            Ir al inicio de sesión
          </PrimaryButton>
        </div>
      </div>
    </GuestLayout>
  );
};

export default VerifyEmail;
