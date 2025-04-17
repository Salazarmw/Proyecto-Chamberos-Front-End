import { useState } from "react";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import InputError from "../../components/InputError";
import PrimaryButton from "../../components/PrimaryButton";
import axios from "../../../../../config/axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    setErrors({});

    try {
      const response = await axios.put("/api/users/me/password", formData);

      if (response.status === 200) {
        // Reset form fields
        setFormData({
          current_password: "",
          password: "",
          password_confirmation: "",
        });

        setStatus("password-updated");
        
        // Show success toast
        toast.success('Password updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Hide status message after 2 seconds
        setTimeout(() => {
          setStatus(null);
        }, 2000);
      }
    } catch (error) {
      console.error("Password update error:", error);
      const errorMessage = error.response?.data?.message || "Error updating password";
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: errorMessage });
      }
      
      // Show error toast
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
        {/* Error general */}
        {errors.general && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
            {errors.general}
          </div>
        )}

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
            required
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
            required
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
            required
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
