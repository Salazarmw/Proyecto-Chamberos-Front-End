import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputLabel from "../components/InputLabel";
import TextInput from "../components/TextInput";
import InputError from "../components/InputError";
import DropdownRegister from "../components/DropdownRegister";
import DateInput from "../components/DateInput";
import PrimaryButton from "../components/PrimaryButton";
import {
  fetchProvinces,
  fetchCantons,
} from "../../../../services/locationService";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    province: "",
    canton: "",
    address: "",
    birth_date: new Date().toISOString().split("T")[0],
    password: "",
    password_confirmation: "",
  });

  const [cantons, setCantons] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadProvinces = async () => {
      const provincesData = await fetchProvinces();
      console.log("Provinces data:", provincesData);
      setProvinces(provincesData);
    };
    loadProvinces();
  }, []);

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    console.log("Selected province ID:", provinceId);
    setFormData({
      ...formData,
      province: provinceId,
      canton: "",
    });

    if (provinceId) {
      try {
        const cantonsData = await fetchCantons(provinceId);
        console.log("Cantons data:", cantonsData);
        setCantons(cantonsData);
      } catch (error) {
        console.error("Error fetching cantons:", error);
      }
    } else {
      setCantons([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrors({});

    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: "Las contraseñas no coinciden" });
      setLoading(false);
      return;
    }

    try {
      const userData = {
        ...formData,
        user_type: "client",
      };

      console.log("Registrando cliente:", userData);

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors || {});
        setError(data.message || "Error en el registro");
        setLoading(false);
        return;
      }

      // Registro exitoso, mostrar mensaje de verificación
      setMessage(
        "Registro exitoso. Por favor, verifica tu correo electrónico para activar tu cuenta."
      );
      setFormData({
        name: "",
        lastname: "",
        email: "",
        phone: "",
        province: "",
        canton: "",
        address: "",
        birth_date: new Date().toISOString().split("T")[0],
        password: "",
        password_confirmation: "",
      });
    } catch (err) {
      console.error("Error en el registro:", err);
      setError("Ocurrió un error durante el registro. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name */}
      <div>
        <InputLabel htmlFor="name" value="Name" />
        <TextInput
          id="name"
          name="name"
          value={formData.name}
          className="block mt-1 w-full"
          autoComplete="name"
          autoFocus={true}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <InputError message={errors.name} className="mt-2" />}
      </div>

      {/* Last Name */}
      <div className="mt-4">
        <InputLabel htmlFor="lastname" value="Last Name" />
        <TextInput
          id="lastname"
          name="lastname"
          value={formData.lastname}
          className="block mt-1 w-full"
          autoComplete="lastname"
          onChange={(e) =>
            setFormData({ ...formData, lastname: e.target.value })
          }
        />
        {errors.lastname && (
          <InputError message={errors.lastname} className="mt-2" />
        )}
      </div>

      {/* Email */}
      <div className="mt-4">
        <InputLabel htmlFor="email" value="Email" />
        <TextInput
          id="email"
          type="email"
          name="email"
          value={formData.email}
          className="block mt-1 w-full"
          autoComplete="username"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <InputError message={errors.email} className="mt-2" />}
      </div>

      {/* Phone */}
      <div className="mt-4">
        <InputLabel htmlFor="phone" value="Phone" />
        <TextInput
          id="phone"
          name="phone"
          value={formData.phone}
          className="block mt-1 w-full"
          autoComplete="tel"
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        {errors.phone && <InputError message={errors.phone} className="mt-2" />}
      </div>

      {/* Province */}
      <div className="mt-4">
        <InputLabel htmlFor="province" value="Province" />
        <DropdownRegister
          id="province"
          name="province"
          value={formData.province}
          options={provinces}
          onChange={handleProvinceChange}
        />
        {errors.province && (
          <InputError message={errors.province} className="mt-2" />
        )}
      </div>

      {/* Canton */}
      <div className="mt-4">
        <InputLabel htmlFor="canton" value="Canton" />
        <DropdownRegister
          id="canton"
          name="canton"
          value={formData.canton}
          options={cantons}
          onChange={(e) => setFormData({ ...formData, canton: e.target.value })}
        />
        {errors.canton && (
          <InputError message={errors.canton} className="mt-2" />
        )}
      </div>

      {/* Address */}
      <div className="mt-4">
        <InputLabel htmlFor="address" value="Address" />
        <TextInput
          id="address"
          name="address"
          value={formData.address}
          className="block mt-1 w-full"
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
        {errors.address && (
          <InputError message={errors.address} className="mt-2" />
        )}
      </div>

      {/* Birth Date */}
      <div className="mt-4">
        <InputLabel htmlFor="birth_date" value="Birth Date" />
        <DateInput
          id="birth_date"
          name="birth_date"
          value={formData.birth_date}
          onChange={(e) =>
            setFormData({ ...formData, birth_date: e.target.value })
          }
        />
        {errors.birth_date && (
          <InputError message={errors.birth_date} className="mt-2" />
        )}
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
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        {errors.password && (
          <InputError message={errors.password} className="mt-2" />
        )}
      </div>

      {/* Password Confirmation */}
      <div className="mt-4">
        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
        <TextInput
          id="password_confirmation"
          type="password"
          name="password_confirmation"
          value={formData.password_confirmation}
          className="block mt-1 w-full"
          onChange={(e) =>
            setFormData({ ...formData, password_confirmation: e.target.value })
          }
        />
        {errors.password_confirmation && (
          <InputError message={errors.password_confirmation} className="mt-2" />
        )}
      </div>

      {/* Error general */}
      {error && (
        <div className="mt-4 p-2 bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400 rounded border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Mensaje de éxito */}
      {message && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md border border-green-200 dark:border-green-800">
          {message}
        </div>
      )}

      <div className="flex items-center justify-end mt-4">
        <Link
          to="/login"
          className="pr-5 justify-start underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
        >
          Already registered?
        </Link>

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Register"}
        </PrimaryButton>

        <Link
          to="/chambero-register"
          className="ml-3 text-center rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
        >
          Register as Chambero
        </Link>
      </div>
    </form>
  );
}
