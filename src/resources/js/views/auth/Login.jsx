import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputLabel from "../components/InputLabel";
import TextInput from "../components/TextInput";
import InputError from "../components/InputError";
import PrimaryButton from "../components/PrimaryButton";
import AuthSessionStatus from "../components/AuthSessionStatus";
import { loginUser } from "../../../../services/authService";
import { resendVerificationEmail } from "../../../../services/verificationService";
import { AuthContext } from "../../../../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setStatus(null);
    setShowResendVerification(false);
    setResendMessage("");

    try {
      const data = await loginUser(formData);
      login(data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.isVerified === false) {
        setShowResendVerification(true);
      }
      setStatus(error.message || "Error during login");
      setErrors({
        general: error.message || "Error during login",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail(formData.email);
      setResendMessage("The verification email has been resent.");
      setShowResendVerification(false);
    } catch (error) {
      setStatus(error.message || "Error resending verification email");
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  return (
    <>
      <AuthSessionStatus status={status} className="mb-4" />

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div>
          <InputLabel htmlFor="email" value="Email" />
          <TextInput
            id="email"
            type="email"
            name="email"
            value={formData.email}
            className="block mt-1 w-full"
            autoComplete="username"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={loading}
          />
          <InputError messages={errors.email} className="mt-2" />
        </div>

        {/* Password */}
        <div className="mt-4">
          <InputLabel htmlFor="password" value="Password" />
          <TextInput
            id="password"
            type="password"
            name="password"
            value={formData.password}
            className="block mt-1 w-full"
            autoComplete="current-password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            disabled={loading}
          />
          <InputError messages={errors.password} className="mt-2" />
        </div>

        {/* Remember Me */}
        <div className="block mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={(e) =>
                setFormData({ ...formData, remember: e.target.checked })
              }
              disabled={loading}
              className="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
            />
            <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
              Remember me
            </span>
          </label>
        </div>

        {showResendVerification && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-md border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm mb-2">
              Tu correo electrónico no ha sido verificado.
            </p>
            <button
              type="button"
              onClick={handleResendVerification}
              className="text-sm underline hover:text-yellow-700 dark:hover:text-yellow-300"
            >
              Reenviar correo de verificación
            </button>
          </div>
        )}

        {resendMessage && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md border border-green-200 dark:border-green-800">
            {resendMessage}
          </div>
        )}

        <div className="flex items-center justify-end mt-4">
          <Link
            to="/forgot-password"
            className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            Forgot your password?
          </Link>

          <PrimaryButton className="ms-3" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </PrimaryButton>

          <Link
            to="/register"
            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white ml-4"
          >
            Register
          </Link>
        </div>
      </form>

      {/* Social Login Buttons */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            <span className="ml-2">Google</span>
          </button>

          <button
            onClick={() => handleSocialLogin('facebook')}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            <span className="ml-2">Facebook</span>
          </button>
        </div>
      </div>
    </>
  );
}
