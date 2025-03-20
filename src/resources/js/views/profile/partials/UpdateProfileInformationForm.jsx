import { useState, useRef } from "react";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import InputError from "../../components/InputError";
import PrimaryButton from "../../components/PrimaryButton";
import { AuthContext } from "../../../../../context/AuthContext";

export default function UpdateProfileInformationForm({ user, tags }) {
  const { updateUser } = AuthContext();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    province: user?.province || "",
    canton: user?.canton || "",
    address: user?.address || "",
    birth_date: user?.birth_date ? formatDate(user.birth_date) : "",
    tags: user?.tags?.map((tag) => tag.id) || [],
    profile_photo: null,
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const fileInputRef = useRef(null);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else if (type === "checkbox") {
      const tagId = parseInt(value);

      if (checked) {
        // Limit to 10 tags
        if (formData.tags.length < 10) {
          setFormData({
            ...formData,
            tags: [...formData.tags, tagId],
          });
        }
      } else {
        setFormData({
          ...formData,
          tags: formData.tags.filter((id) => id !== tagId),
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const sendVerificationEmail = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/email/verification-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setEmailVerificationSent(true);
      }
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data object for file upload
    const submitData = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (key === "tags") {
        formData[key].forEach((tagId) => {
          submitData.append("tags[]", tagId);
        });
      } else if (key === "profile_photo" && formData[key]) {
        submitData.append(key, formData[key]);
      } else {
        submitData.append(key, formData[key]);
      }
    });

    // Add method field for Laravel
    submitData.append("_method", "PATCH");

    try {
      const response = await fetch("/api/profile", {
        method: "POST", // FormData requires POST
        body: submitData,
      });

      if (response.ok) {
        setStatus("profile-updated");
        updateUser(formData);

        // Hide status message after 2 seconds
        setTimeout(() => {
          setStatus(null);
        }, 2000);
      } else {
        const data = await response.json();
        setErrors(data.errors || {});
      }
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  return (
    <section>
      <header>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Profile Information
        </h2>

        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Update your account's profile information and email address.
        </p>
      </header>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        {/* Name field */}
        <div>
          <InputLabel htmlFor="name" value="Name" />
          <TextInput
            id="name"
            name="name"
            type="text"
            className="mt-1 block w-full"
            value={formData.name}
            onChange={handleInputChange}
            required
            autoFocus
          />
          <InputError messages={errors.name} className="mt-2" />
        </div>

        {/* Last name field */}
        <div>
          <InputLabel htmlFor="lastname" value="Last Name" />
          <TextInput
            id="lastname"
            name="lastname"
            type="text"
            className="mt-1 block w-full"
            value={formData.lastname}
            onChange={handleInputChange}
            required
          />
          <InputError messages={errors.lastname} className="mt-2" />
        </div>

        {/* Email field */}
        <div>
          <InputLabel htmlFor="email" value="Email" />
          <TextInput
            id="email"
            name="email"
            type="email"
            className="mt-1 block w-full"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <InputError messages={errors.email} className="mt-2" />

          {user && user.email_verified_at === null && (
            <div>
              <p className="text-sm mt-2 text-gray-800 dark:text-gray-200">
                Your email address is unverified.
                <button
                  onClick={sendVerificationEmail}
                  className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ml-1"
                >
                  Click here to re-send the verification email.
                </button>
              </p>

              {emailVerificationSent && (
                <p className="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
                  A new verification link has been sent to your email address.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Telephone field */}
        <div>
          <InputLabel htmlFor="phone" value="Phone" />
          <TextInput
            id="phone"
            name="phone"
            type="text"
            className="mt-1 block w-full"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <InputError messages={errors.phone} className="mt-2" />
        </div>

        {/* Province field */}
        <div>
          <InputLabel htmlFor="province" value="Province" />
          <TextInput
            id="province"
            name="province"
            type="text"
            className="mt-1 block w-full"
            value={formData.province}
            onChange={handleInputChange}
            required
          />
          <InputError messages={errors.province} className="mt-2" />
        </div>

        {/* Canton field */}
        <div>
          <InputLabel htmlFor="canton" value="Canton" />
          <TextInput
            id="canton"
            name="canton"
            type="text"
            className="mt-1 block w-full"
            value={formData.canton}
            onChange={handleInputChange}
            required
          />
          <InputError messages={errors.canton} className="mt-2" />
        </div>

        {/* Address field */}
        <div>
          <InputLabel htmlFor="address" value="Address" />
          <TextInput
            id="address"
            name="address"
            type="text"
            className="mt-1 block w-full"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
          <InputError messages={errors.address} className="mt-2" />
        </div>

        {/* Birth date field */}
        <div>
          <InputLabel htmlFor="birth_date" value="Birth Date" />
          <TextInput
            id="birth_date"
            name="birth_date"
            type="date"
            className="mt-1 block w-full"
            value={formData.birth_date}
            onChange={handleInputChange}
            required
          />
          <InputError messages={errors.birth_date} className="mt-2" />
        </div>

        {/* Chambero Tags Section (Only for Chambero type users) */}
        {user && user.user_type === "chambero" && (
          <div>
            <InputLabel htmlFor="tags" value="Professional Tags" />
            <div className="mt-2 grid grid-cols-2 gap-2">
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="tags"
                    value={tag.id}
                    checked={formData.tags.includes(tag.id)}
                    onChange={handleInputChange}
                    className="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {tag.description}
                  </span>
                </label>
              ))}
            </div>
            <InputError messages={errors.tags} className="mt-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Select up to 10 tags that describe your professional skills and
              services.
            </p>
          </div>
        )}

        {/* Profile photo field */}
        <div>
          <InputLabel htmlFor="profile_photo" value="Profile Photo" />
          <input
            type="file"
            id="profile_photo"
            name="profile_photo"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleInputChange}
            className="mt-1 block w-full text-gray-700 dark:text-gray-300"
          />
          {user && user.profile_photo && (
            <img
              src={`/storage/${user.profile_photo}`}
              alt="Profile Photo"
              className="mt-2 rounded-full h-20 w-20 object-cover"
            />
          )}
          <InputError messages={errors.profile_photo} className="mt-2" />
        </div>

        {/* Save button */}
        <div className="flex items-center gap-4">
          <PrimaryButton type="submit">Save</PrimaryButton>

          {status === "profile-updated" && (
            <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
          )}
        </div>
      </form>
    </section>
  );
}
