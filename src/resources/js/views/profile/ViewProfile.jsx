import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const ViewProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        const data = await response.json();
        setUser(data.user);
        setTags(data.tags);
        setAverageRating(data.averageRating);
        setRatingCount(data.ratingCount);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    loadReviews();
  }, [id]);

  const loadReviews = async () => {
    try {
      const response = await fetch(
        `/api/reviews/${id}?offset=${offset}&limit=${limit}`
      );
      const data = await response.json();

      if (data.reviews && data.reviews.length > 0) {
        setReviews((prev) => [...prev, ...data.reviews]);
        setOffset((prev) => prev + limit);

        if (data.reviews.length < limit) {
          document.getElementById("load-more").style.display = "none";
        }
      } else {
        document.getElementById("load-more").style.display = "none";
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  if (!user) {
    return <div className="text-center p-10">Cargando perfil...</div>;
  }

  return (
    <div className="container mx-auto flex flex-col md:flex-row space-x-0 md:space-x-6 p-6">
      {/* Profile Details Section */}
      <div className="w-full md:w-1/4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md mb-6 md:mb-0">
        <div className="text-center">
          <img
            src={
              user.profile_photo
                ? `/storage/${user.profile_photo}`
                : "/storage/profile-photos/DefaultImage.jpeg"
            }
            alt="Profile Photo"
            className="w-32 h-32 rounded-full object-cover mb-4 mx-auto"
          />
          <h5 className="text-xl font-bold">
            {user.name} {user.lastname}
          </h5>
          <div className="mt-4">
            <Link
              to={`/quotations/create/${user.id}`}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Cotizar
            </Link>
          </div>
        </div>
        <hr className="my-4" />
        <div className="card-body">
          <h5 className="text-lg font-semibold">Skills</h5>
          <div className="flex flex-wrap mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <hr className="my-4" />
        <div>
          <h5 className="text-lg font-semibold">Información de Contacto</h5>
          <ul className="list-none mb-0">
            <li>
              <strong>Teléfono:</strong>{" "}
              <span className="text-white">{user.phone}</span>
            </li>
            <li>
              <strong>Email:</strong>{" "}
              <span className="text-white">{user.email}</span>
            </li>
            <li>
              <strong>Dirección:</strong>
              <span className="text-white">
                {user.address}, {user.canton}, {user.province}
              </span>
            </li>
          </ul>
        </div>
        <hr className="my-4" />
        <div>
          <h5 className="text-lg font-semibold">Redes Sociales</h5>
          <ul className="list-none mb-0">
            <li>
              <a href="#" className="text-indigo-600 hover:underline">
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="text-indigo-600 hover:underline">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="text-indigo-600 hover:underline">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="w-full md:w-3/4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Reseñas</h2>
        <div
          id="reviews-container"
          className="max-h-[300px] overflow-y-auto border border-gray-300 dark:border-gray-700 p-4 rounded-md mt-4"
        >
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 bg-gray-700 p-4 mb-4"
              >
                {/* Profile and Rating */}
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <div className="w-7 h-7 text-center rounded-full bg-red-500">
                      {review.fromUser.name.substr(0, 1)}
                    </div>
                    <span className="text-white">{review.fromUser.name}</span>
                  </div>
                  <div className="flex p-1 gap-1 text-orange-300">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star text-yellow-500"></i>
                    ))}
                  </div>
                </div>

                <div className="text-white">{review.comment}</div>

                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No hay reseñas disponibles.
            </p>
          )}
        </div>

        {/* Load more button */}
        <button
          id="load-more"
          className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          onClick={loadReviews}
        >
          Cargar más reseñas
        </button>

        {/* Average Rating Display */}
        {averageRating > 0 && (
          <p className="mt-2 text-gray-700 dark:text-white">
            Calificación promedio:
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`fas fa-star ${
                  i < Math.round(averageRating)
                    ? "text-yellow-500"
                    : "text-yellow-500"
                }`}
              ></i>
            ))}
            ({ratingCount} reseñas)
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewProfile;
