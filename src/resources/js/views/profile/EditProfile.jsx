import { useState, useEffect, useContext } from "react";
import axios from "../../config/axios";
import UpdateProfileInformationForm from "./partials/UpdateProfileInformationForm";
import UpdatePasswordForm from "./partials/UpdatePasswordForm";
import DeleteUserForm from "./partials/DeleteUserForm";
import { AuthContext } from "../../../../context/AuthContext";

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: authUser, updateUser } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const [userResponse, tagsResponse] = await Promise.all([
        axios.get("/api/users/me"),
        axios.get("/api/tags")
      ]);

      console.log("User data:", userResponse.data);
      console.log("Tags data:", tagsResponse.data);

      // Actualizar el estado local
      setUser(userResponse.data);
      setTags(tagsResponse.data.tags || []);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError(error.response?.data?.message || "Error al cargar los datos");
      setLoading(false);
    }
  };

  // Solo cargar datos iniciales una vez
  useEffect(() => {
    fetchData();
  }, []);

  // Actualizar el estado local cuando se actualice el usuario
  useEffect(() => {
    if (authUser && (!user || JSON.stringify(user) !== JSON.stringify(authUser))) {
      setUser(authUser);
    }
  }, [authUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
          <div className="max-w-xl">
            <UpdateProfileInformationForm user={user} tags={tags} onUpdate={fetchData} />
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
