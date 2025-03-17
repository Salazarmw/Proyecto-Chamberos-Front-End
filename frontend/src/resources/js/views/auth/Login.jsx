// resources/js/Pages/Auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GuestLayout from "../layouts/GuestLayout";
import InputLabel from "../components/InputLabel";
import TextInput from "../components/TextInput";
import InputError from "../components/InputError";
import PrimaryButton from "../components/PrimaryButton";
import AuthSessionStatus from "../components/AuthSessionStatus";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/dashboard");
      } else {
        setErrors(data.errors || {});
        setStatus(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setStatus("An error occurred during login");
    }
  };

  return (
    <GuestLayout>
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

          <PrimaryButton className="ms-3" type="submit">
            Log in
          </PrimaryButton>

          <Link
            to="/register"
            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white ml-4"
          >
            Register
          </Link>
        </div>
      </form>
    </GuestLayout>
  );
}
