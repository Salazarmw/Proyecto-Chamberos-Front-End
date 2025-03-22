import { useState } from "react";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import InputError from "../../components/InputError";
import PrimaryButton from "../../components/PrimaryButton";

export default function UpdatePasswordForm() {
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reset form fields
        setFormData({
          current_password: "",
          password: "",
          password_confirmation: "",
        });

        setStatus("password-updated");

        // Hide status message after 2 seconds
        setTimeout(() => {
          setStatus(null);
        }, 2000);
      } else {
        const data = await response.json();
        setErrors(data.errors || {});
      }
    } catch (error) {
      console.error("Password update error:", error);
    }
  };

  return (
    <section>
      <header>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Update Password
        </h2>

        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </header>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div>
          <InputLabel htmlFor="current_password" value="Current Password" />
          <TextInput
            id="current_password"
            name="current_password"
            type="password"
            className="mt-1 block w-full"
            value={formData.current_password}
            onChange={handleInputChange}
            autoComplete="current-password"
          />
          <InputError messages={errors.current_password} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="password" value="New Password" />
          <TextInput
            id="password"
            name="password"
            type="password"
            className="mt-1 block w-full"
            value={formData.password}
            onChange={handleInputChange}
            autoComplete="new-password"
          />
          <InputError messages={errors.password} className="mt-2" />
        </div>

        <div>
          <InputLabel
            htmlFor="password_confirmation"
            value="Confirm Password"
          />
          <TextInput
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            className="mt-1 block w-full"
            value={formData.password_confirmation}
            onChange={handleInputChange}
            autoComplete="new-password"
          />
          <InputError
            messages={errors.password_confirmation}
            className="mt-2"
          />
        </div>

        <div className="flex items-center gap-4">
          <PrimaryButton type="submit">Save</PrimaryButton>

          {status === "password-updated" && (
            <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
          )}
        </div>
      </form>
    </section>
  );
}
