import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import { AuthContext } from "../../../../context/AuthContext";

const ViewProfile = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        console.log("User data:", response.data);
        
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("No se encontró el perfil del usuario.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleProtectedAction = (action) => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Handle the action if user is authenticated
    if (action === 'quote') {
      navigate(`/quotations/create/${id}`);
    }
  };

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
        <h1 className="text-3xl font-bold mb-4">404</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-4 text-center text-gray-600">
        <p>No se encontró el perfil del usuario.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Header con foto y nombre */}
        <div className="relative h-48 bg-indigo-600">
          <div className="absolute -bottom-12 left-8">
            <img
              src={
                userData.profile_photo
                  ? userData.profile_photo
                  : "https://chambero-profile-bucket.s3.us-east-2.amazonaws.com/Profile_avatar_placeholder_large.png"
              }
              alt="Profile Photo"
              className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover"
            />
          </div>
        </div>

        {/* Información del usuario */}
        <div className="pt-16 px-8 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.name} {userData.lastname}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{userData.email}</p>
            </div>
            <button
              onClick={() => handleProtectedAction('quote')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Cotizar
            </button>
          </div>

          {/* Información de contacto */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Información de Contacto
              </h2>
              <div className="space-y-3">
                <p className="flex items-center text-gray-600 dark:text-gray-400">
                  <i className="fas fa-phone mr-2"></i>
                  {userData.phone || "No disponible"}
                </p>
                <p className="flex items-center text-gray-600 dark:text-gray-400">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  {userData.address || "No disponible"}
                  {userData.canton && `, ${userData.canton}`}
                  {userData.province && `, ${userData.province}`}
                </p>
              </div>
            </div>

            {/* Servicios */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Servicios
              </h2>
              <div className="flex flex-wrap gap-2">
                {userData.tags && userData.tags.length > 0 ? (
                  userData.tags.map((tag) => (
                    <span
                      key={tag._id}
                      className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm"
                    >
                      {tag.name}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No hay servicios disponibles
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
