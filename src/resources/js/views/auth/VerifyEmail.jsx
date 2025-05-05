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
      <div className="w-full max-w-md mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            Verificación de Correo Electrónico
          </h1>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Verificando tu correo electrónico...
                </p>
              </div>
            ) : message ? (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-md border border-green-200 dark:border-green-800 text-center">
                {message}
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md border border-red-200 dark:border-red-800 text-center">
                {error}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <PrimaryButton
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto"
              >
                Ir al inicio de sesión
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
};

export default VerifyEmail;
