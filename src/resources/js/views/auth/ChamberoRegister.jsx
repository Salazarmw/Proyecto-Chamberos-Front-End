import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const ChamberoRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    province: "",
    canton: "",
    address: "",
    birth_date: new Date(new Date().setFullYear(new Date().getFullYear() - 19))
      .toISOString()
      .split("T")[0],
    password: "",
    password_confirmation: "",
    tags: [],
  });

  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [cantons, setCantons] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    fetchProvinces();
    fetchTags();
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await fetch("/api/provinces");
      if (response.ok) {
        const data = await response.json();
        setProvinces(data);
      }
    } catch (error) {
      console.error("Error loading provinces:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tags");
      if (response.ok) {
        const data = await response.json();
        setAvailableTags(data);
      }
    } catch (error) {
      console.error("Error loading tags:", error);
    }
  };

  const fetchCantons = async (provinceId) => {
    if (!provinceId) {
      setCantons([]);
      return;
    }

    try {
      const response = await fetch(`/api/get-cantons/${provinceId}`);
      if (response.ok) {
        const data = await response.json();
        setCantons(data);
      }
    } catch (error) {
      console.error("Error loading cantons:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "province") {
      fetchCantons(value);
      setFormData((prev) => ({
        ...prev,
        canton: "",
      }));
    }
  };

  const handleTagChange = (tagId) => {
    if (formData.tags.includes(tagId)) {
      setFormData({
        ...formData,
        tags: formData.tags.filter((id) => id !== tagId),
      });
    } else {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagId],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await fetch("/api/chambero/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content"),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || {});
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrors({
        general: ["An unexpected error occurred. Please try again."],
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
      <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block font-medium text-sm text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              autoFocus
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name[0]}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="mt-4">
            <label
              htmlFor="lastname"
              className="block font-medium text-sm text-gray-700 dark:text-gray-300"
            >
              Last Name
            </label>
            <input
              id="lastname"
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            {errors.lastname && (
              <p className="mt-2 text-sm text-red-600">{errors.lastname[0]}</p>
            )}
          </div>

          {/* Email */}
          <div className="mt-4">
            <label
              htmlFor="email"
              className="block font-medium text-sm text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email[0]}</p>
            )}
          </div>

          {/* Phone */}
          <div className="mt-4">
            <label
              htmlFor="phone"
              className="block font-medium text-sm text-gray-700 dark:text-gray-300"
            >
              Phone
            </label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600">{errors.phone[0]}</p>
            )}
          </div>

          {/* Province */}
          <div className="mt-4">
            <label
              htmlFor="province"
              className="block font-medium text-sm text-gray-700 dark:text-gray-300"
            >
              Province
            </label>
            <select
              id="province"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">Select a province</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="mt-2 text-sm text-red-600">{errors.province[0]}</p>
            )}
          </div>

          {/* Canton */}
          <div className="mt-4">
            <label
              htmlFor="canton"
              className="block font-medium text-sm text-gray-700 dark:text-gray-300"
            >
              Canton
            </label>
            <select
              id="canton"
              name="canton"
              value={formData.canton}
              onChange={handleInputChange}
              className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              disabled={!formData.province}
            >
              <option value="">Select a canton</option>
              {cantons.map((canton) => (
                <option key={canton.id} value={canton.id}>
                  {canton.name}
                </option>
              ))}
            </select>
            {errors.canton && (
              <p className="mt-2 text-sm text-red-600">{errors.canton[0]}</p>
            )}
          </div>

          {/* Address */}
          <div className="mt-4">
            <label
              htmlFor="address"
              className="block font-medium text-sm text-gray-700 dark:text-gray-300"
            >
              Address
            </label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.address && (
              <p className="mt-2 text-sm text-red-600">{errors.address[0]}</p>
            )}
          </div>

          {/* Birth Date */}
          <div className="mt-4">
            <label
              htmlFor="birth_date"
              className="block font-medium text-sm text-gray-700 dark:text-gray-300"
            >
              Birth Date
            </label>
            <input
              id="birth_date"
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleInputChange}
              className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            {errors.birth_date && (
              <p className="mt-2 text-sm text-red-600">
                {errors.birth_date[0]}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block font-medium text-sm text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password[0]}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mt-4">
            <label
              htmlFor="password_confirmation"
              className="block font-medium text-sm text-gray-700 dark:text-gray-300"
            >
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleInputChange}
              className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            {errors.password_confirmation && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password_confirmation[0]}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="mt-4">
            <label className="block font-medium text-sm text-gray-700 dark:text-gray-300">
              Select Tags
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {availableTags.map((tag) => (
                <div key={tag.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={formData.tags.includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <label
                    htmlFor={`tag-${tag.id}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {tag.name}
                  </label>
                </div>
              ))}
            </div>
            {errors.tags && (
              <p className="mt-2 text-sm text-red-600">{errors.tags[0]}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end mt-4">
            <Link
              to="/login"
              className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Already registered?
            </Link>

            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 ml-4"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChamberoRegister;
