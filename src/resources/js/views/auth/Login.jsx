import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputLabel from "../components/InputLabel";
import TextInput from "../components/TextInput";
import InputError from "../components/InputError";
import PrimaryButton from "../components/PrimaryButton";
import AuthSessionStatus from "../components/AuthSessionStatus";
import { loginUser } from "../../../../services/authService";
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
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setStatus(null);

    try {
      const data = await loginUser(formData);
      login(data);
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (error) {
      console.error("Login error:", error);
      setStatus(error.message || "Error during login");
      setErrors({
        general: error.message || "Error during login",
      });
    } finally {
      setLoading(false);
    }
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
    </>
  );
}