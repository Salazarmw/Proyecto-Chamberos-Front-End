import { useState, useEffect } from "react";
import UpdateProfileInformationForm from "./partials/UpdateProfileInformationForm";
import UpdatePasswordForm from "./partials/UpdatePasswordForm";
import DeleteUserForm from "./partials/DeleteUserForm";

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data and tags
    const fetchData = async () => {
      try {
        const userResponse = await fetch("/api/user");
        const userData = await userResponse.json();
        setUser(userData);

        const tagsResponse = await fetch("/api/tags");
        const tagsData = await tagsResponse.json();
        setTags(tagsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
          <div className="max-w-xl">
            <UpdateProfileInformationForm user={user} tags={tags} />
          </div>
        </div>

        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
          <div className="max-w-xl">
            <UpdatePasswordForm />
          </div>
        </div>

        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
          <div className="max-w-xl">
            <DeleteUserForm />
          </div>
        </div>
      </div>
    </div>
  );
}
