// resources/js/Pages/Auth/Register.jsx
import GuestLayout from "@/Layouts/GuestLayout";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import DropdownRegister from "@/Components/DropdownRegister";
import DateInput from "@/Components/DateInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Register({ provinces }) {
  const { data, setData, post, processing, errors } = useForm({
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

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setData("province", provinceId);
    setData("canton", "");

    if (provinceId) {
      try {
        const response = await fetch(`/get-cantons/${provinceId}`);
        const data = await response.json();
        setCantons(data);
      } catch (error) {
        console.error("Error fetching cantons:", error);
      }
    } else {
      setCantons([]);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    post(route("register"));
  };

  return (
    <GuestLayout>
      <Head title="Register" />

      <form onSubmit={submit}>
        {/* Name */}
        <div>
          <InputLabel htmlFor="name" value="Name" />
          <TextInput
            id="name"
            name="name"
            value={data.name}
            className="block mt-1 w-full"
            autoComplete="name"
            isFocused
            onChange={(e) => setData("name", e.target.value)}
          />
          <InputError message={errors.name} className="mt-2" />
        </div>

        {/* Last Name */}
        <div className="mt-4">
          <InputLabel htmlFor="lastname" value="Last Name" />
          <TextInput
            id="lastname"
            name="lastname"
            value={data.lastname}
            className="block mt-1 w-full"
            autoComplete="lastname"
            onChange={(e) => setData("lastname", e.target.value)}
          />
          <InputError message={errors.lastname} className="mt-2" />
        </div>

        {/* Email */}
        <div className="mt-4">
          <InputLabel htmlFor="email" value="Email" />
          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="block mt-1 w-full"
            autoComplete="username"
            onChange={(e) => setData("email", e.target.value)}
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        {/* Phone */}
        <div className="mt-4">
          <InputLabel htmlFor="phone" value="Phone" />
          <TextInput
            id="phone"
            name="phone"
            value={data.phone}
            className="block mt-1 w-full"
            autoComplete="phone"
            onChange={(e) => setData("phone", e.target.value)}
          />
          <InputError message={errors.phone} className="mt-2" />
        </div>

        {/* Province */}
        <div className="mt-4">
          <DropdownRegister
            id="province"
            name="province"
            label="Province"
            options={provinces}
            value={data.province}
            onChange={handleProvinceChange}
            required
          />
          <InputError message={errors.province} className="mt-2" />
        </div>

        {/* Canton */}
        <div className="mt-4">
          <DropdownRegister
            id="canton"
            name="canton"
            label="Canton"
            options={cantons}
            value={data.canton}
            onChange={(e) => setData("canton", e.target.value)}
            required
          />
          <InputError message={errors.canton} className="mt-2" />
        </div>

        {/* Address */}
        <div className="mt-4">
          <InputLabel htmlFor="address" value="Address" />
          <TextInput
            id="address"
            name="address"
            value={data.address}
            className="block mt-1 w-full"
            onChange={(e) => setData("address", e.target.value)}
          />
          <InputError message={errors.address} className="mt-2" />
        </div>

        {/* Birth Date */}
        <div className="mt-4">
          <InputLabel htmlFor="birth_date" value="Birth Date" />
          <DateInput
            id="birth_date"
            name="birth_date"
            value={data.birth_date}
            className="block mt-1 w-full"
            onChange={(e) => setData("birth_date", e.target.value)}
            required
          />
          <InputError message={errors.birth_date} className="mt-2" />
        </div>

        {/* Password */}
        <div className="mt-4">
          <InputLabel htmlFor="password" value="Password" />
          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="block mt-1 w-full"
            autoComplete="new-password"
            onChange={(e) => setData("password", e.target.value)}
            required
          />
          <InputError message={errors.password} className="mt-2" />
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
            value={data.password_confirmation}
            className="block mt-1 w-full"
            autoComplete="new-password"
            onChange={(e) => setData("password_confirmation", e.target.value)}
            required
          />
          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="flex items-center justify-end mt-4">
          <Link
            href={route("login")}
            className="pr-5 justify-start underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            Already registered?
          </Link>

          <PrimaryButton className="ms-4" disabled={processing}>
            Register
          </PrimaryButton>

          {route().has("chamberoRegister") && (
            <Link
              href={route("chamberoRegister")}
              className="text-center rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
            >
              Register as Chambero
            </Link>
          )}
        </div>
      </form>
    </GuestLayout>
  );
}
