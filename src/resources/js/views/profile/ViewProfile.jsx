import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import WorkGallery from "../../components/WorkGallery";
import { AuthContext } from "../../../../context/AuthContext";

const GRAPHQL_URL = "http://localhost:4000/graphql";

const ViewProfile = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [provinceName, setProvinceName] = useState("");
  const [cantonName, setCantonName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        setError("No se encontró el perfil del usuario.");
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  useEffect(() => {
    const fetchProvinceAndCanton = async () => {
      if (userData) {
        if (userData.province) {
          try {
            const res = await axios.get(`/api/provinces/${userData.province}`);
            setProvinceName(res.data.name || "");
          } catch {
            setProvinceName("");
          }
        }
        if (userData.canton) {
          try {
            const res = await axios.get(`/api/cantons/${userData.canton}`);
            setCantonName(res.data.name || "");
          } catch {
            setCantonName("");
          }
        }
      }
    };
    fetchProvinceAndCanton();
  }, [userData]);

  const handleProtectedAction = (action) => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Handle the action if user is authenticated
    if (action === "quote") {
      navigate(`/quotations/create/${id}`);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const query = `
          query GetReviews($chamberoId: ID!) {
            reviews(chamberoId: $chamberoId) {
              id
              rating
              comment
              createdAt
              user {
                id
                name
                profile_photo
              }
            }
          }
        `;
        const res = await fetch(GRAPHQL_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            query,
            variables: { chamberoId: id },
          }),
        });
        const { data } = await res.json();
        if (data && data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        } else {
          // Si GraphQL no devuelve reviews, usar la REST API
          const restRes = await axios.get(`/api/reviews/user/${id}`);
          if (restRes.data && restRes.data.reviews) {
            // Adaptar formato para que coincida con el renderizado
            const adapted = restRes.data.reviews.map((r) => ({
              id: r._id,
              rating: r.rating,
              comment: r.comment,
              createdAt: r.created_at,
              user: {
                id: r.fromUser._id || r.fromUser,
                name: r.fromUser.name || "Usuario",
                profile_photo: r.fromUser.profile_photo || null,
              },
            }));
            setReviews(adapted);
          }
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [id]);

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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Perfil principal */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
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
                <p className="text-gray-600 dark:text-gray-400">
                  {userData.email}
                </p>
              </div>
              <Link
                to={`/quotations/create/${userData._id}`}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Cotizar
              </Link>
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
                    {cantonName && `, ${cantonName}`}
                    {provinceName && `, ${provinceName}`}
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
        {/* Galería de trabajos (solo para chamberos) */}
        {userData && userData.user_type === "chambero" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Galería de Trabajos
            </h2>
            <WorkGallery userId={userData._id} isOwner={false} />
          </div>
        )}
        {/* Reviews */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Reseñas
          </h2>
          {reviews.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">
              No hay reseñas para este usuario.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={
                        review.user.profile_photo
                          ? review.user.profile_photo
                          : "https://chambero-profile-bucket.s3.us-east-2.amazonaws.com/Profile_avatar_placeholder_large.png"
                      }
                      alt={`${review.user.name}'s profile`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {review.user.name}
                      </h3>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            className={`text-lg ${
                              index < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    {review.comment}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
