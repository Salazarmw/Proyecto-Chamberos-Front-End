/* src/resources/js/views/auth/Register.jsx */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GuestLayout from "../layouts/GuestLayout";
import InputLabel from "../components/InputLabel";
import TextInput from "../components/TextInput";
import InputError from "../components/InputError";
import DropdownRegister from "../components/DropdownRegister";
import DateInput from "../components/DateInput";
import PrimaryButton from "../components/PrimaryButton";

export default function Register({ provinces }) {
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
  const [errors, setErrors] = useState({});

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setFormData({
      ...formData,
      province: provinceId,
      canton: "",
    });

    if (provinceId) {
      try {
        const response = await fetch(`/api/get-cantons/${provinceId}`);
        const data = await response.json();
        setCantons(data);
      } catch (error) {
        console.error("Error fetching cantons:", error);
      }
    } else {
      setCantons([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors || {});
        throw new Error(data.message || "Registration failed");
      }

      // Redirigir a login después de registro exitoso
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <GuestLayout>
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
            isFocused
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
          {errors.name && <InputError message={errors.name} className="mt-2" />}
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
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.name && <InputError message={errors.name} className="mt-2" />}
        </div>

        {/* Phone */}
        <div className="mt-4">
          <InputLabel htmlFor="phone" value="Phone" />
          <TextInput
            id="phone"
            name="phone"
            value={formData.phone}
            className="block mt-1 w-full"
            autoComplete="phone"
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          {errors.name && <InputError message={errors.name} className="mt-2" />}
        </div>

        {/* Province */}
        <div className="mt-4">
          <DropdownRegister
            id="province"
            name="province"
            label="Province"
            options={provinces}
            value={formData.province}
            onChange={handleProvinceChange}
            required
          />
          {errors.name && <InputError message={errors.name} className="mt-2" />}
        </div>

        {/* Canton */}
        <div className="mt-4">
          <DropdownRegister
            id="canton"
            name="canton"
            label="Canton"
            options={cantons}
            value={formData.canton}
            onChange={(e) =>
              setFormData({ ...formData, canton: e.target.value })
            }
            required
          />
          {errors.name && <InputError message={errors.name} className="mt-2" />}
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
          {errors.name && <InputError message={errors.name} className="mt-2" />}
        </div>

        {/* Birth Date */}
        <div className="mt-4">
          <InputLabel htmlFor="birth_date" value="Birth Date" />
          <DateInput
            id="birth_date"
            name="birth_date"
            value={formData.birth_date}
            className="block mt-1 w-full"
            onChange={(e) =>
              setFormData({ ...formData, birth_date: e.target.value })
            }
            required
          />
          {errors.name && <InputError message={errors.name} className="mt-2" />}
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
            autoComplete="new-password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          {errors.name && <InputError message={errors.name} className="mt-2" />}
        </div>

        {/* Confirm Password */}
        <div className="mt-4">
          <InputLabel
            htmlFor="password_confirmation"
            value="Confirm Password"
          />
          <TextInput
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            className="block mt-1 w-full"
            autoComplete="new-password"
            onChange={(e) =>
              setFormData({
                ...formData,
                password_confirmation: e.target.value,
              })
            }
            required
          />
          {errors.name && <InputError message={errors.name} className="mt-2" />}
        </div>

        <div className="flex items-center justify-end mt-4">
          <Link
            to="/login"
            className="pr-5 justify-start underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            Already registered?
          </Link>

          <PrimaryButton type="submit">Register</PrimaryButton>

          <Link
            to="/chambero-register"
            className="text-center rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
          >
            Register as Chambero
          </Link>
        </div>
      </form>
    </GuestLayout>
  );
}
