import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/TextInput";
import InputLabel from "../../components/InputLabel";
import InputError from "../../components/InputError";
import DangerButton from "../../components/DangerButton";
import SecondaryButton from "../../components/SecondaryButton";
import { AuthContext } from "../../../../../context/AuthContext";

export default function DeleteUserForm() {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { logout } = AuthContext();

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };

  const closeModal = () => {
    setConfirmingUserDeletion(false);
    setPassword("");
    setErrors({});
  };

  const deleteUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        await logout();
        navigate("/");
      } else {
        const data = await response.json();
        setErrors(data.errors || {});
      }
    } catch (error) {
      console.error("Account deletion error:", error);
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Delete Account
        </h2>

        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Once your account is deleted, all of its resources and data will be
          permanently deleted. Before deleting your account, please download any
          data or information that you wish to retain.
        </p>
      </header>

      <DangerButton onClick={confirmUserDeletion}>Delete Account</DangerButton>

      {confirmingUserDeletion && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
            <form onSubmit={deleteUser} className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Are you sure you want to delete your account?
              </h2>

              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Once your account is deleted, all of its resources and data will
                be permanently deleted. Please enter your password to confirm
                you would like to permanently delete your account.
              </p>

              <div className="mt-6">
                <InputLabel
                  htmlFor="password"
                  value="Password"
                  className="sr-only"
                />

                <TextInput
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-3/4"
                  placeholder="Password"
                />

                <InputError messages={errors.password} className="mt-2" />
              </div>

              <div className="mt-6 flex justify-end">
                <SecondaryButton onClick={closeModal} type="button">
                  Cancel
                </SecondaryButton>

                <DangerButton className="ms-3" type="submit">
                  Delete Account
                </DangerButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
