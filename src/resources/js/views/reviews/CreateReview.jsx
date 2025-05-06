import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../../config/axios";
import { AuthContext } from "../../../../context/AuthContext";

const CreateReview = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      setError("Debe iniciar sesión para crear una review");
      setLoading(false);
      return;
    }
    fetchJobData();
  }, [jobId, user]);

  const fetchJobData = async () => {
    try {
      const response = await axios.get(`/api/jobs/${jobId}`);
      const jobData = response.data;

      // Verificar que el trabajo existe y está completado
      if (!jobData || jobData.status !== "completed") {
        setError("Este trabajo no está disponible para review");
        return;
      }

      // Verificar que el usuario es el cliente y no ha hecho review
      if (user.user_type !== "client" || jobData.has_review) {
        setError("No puedes hacer review de este trabajo");
        return;
      }

      setJob(jobData);
    } catch (error) {
      setError("Error al cargar los datos del trabajo");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
    setHoverRating(value);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      setError("Por favor selecciona una calificación");
      return;
    }

    try {
      const response = await axios.post("/api/reviews", {
        jobId,
        rating,
        comment,
        fromUser: job.client_id?._id || job.client_id,
        toUser: job.chambero_id?._id || job.chambero_id,
      });

      console.log("Review creada exitosamente:", response.data);

      // Mostrar mensaje de éxito
      alert("¡Gracias por tu reseña! Será publicada en breve.");

      // Redirigir al dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al crear la review:", error);
      setError(error.response?.data?.message || "Error al guardar la review");
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-800 flex justify-center items-center">
        <p className="text-white">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-800 flex justify-center items-center">
        <p className="text-white">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-800">
      <div className="pt-10 md:pt-20">
        <div className="p-4 md:p-8">
          <h1 className="text-white text-center pb-8 font-light text-4xl md:text-5xl lg:text-6xl">
            Califica el Servicio
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="md:w-3/4 lg:w-2/3 xl:w-1/2">
              <div className="flex flex-col md:flex-row items-center">
                <img
                  src={
                    user.profile_photo
                      ? user.profile_photo
                      : "https://chambero-profile-bucket.s3.us-east-2.amazonaws.com/Profile_avatar_placeholder_large.png"
                  }
                  alt="Foto de perfil"
                  className="rounded-full w-16 h-16 mr-4"
                />
                <span className="my-2 py-2 px-4 rounded-md bg-gray-900 text-gray-300 w-full md:w-1/2 md:mr-2">
                  {user.name} {user.lastname}
                </span>
              </div>

              {/* Rating Stars */}
              <div className="my-4 flex items-center">
                <label htmlFor="rating" className="text-gray-300 mr-4">
                  Calificación:
                </label>
                {[1, 2, 3, 4, 5].map((star) => (
                  <React.Fragment key={star}>
                    <input
                      type="radio"
                      name="rating"
                      id={`star${star}`}
                      value={star}
                      checked={rating === star}
                      onChange={() => setRating(star)}
                      className="hidden peer"
                      required
                    />
                    <label
                      htmlFor={`star${star}`}
                      className={`cursor-pointer text-2xl ${
                        (hoverRating || rating) >= star
                          ? "text-yellow-500"
                          : "text-gray-400"
                      } hover:text-yellow-500 transition-colors duration-200`}
                      onMouseEnter={() => handleStarHover(star)}
                      onMouseLeave={handleStarLeave}
                      onClick={() => handleStarClick(star)}
                    >
                      ★
                    </label>
                  </React.Fragment>
                ))}
              </div>

              {/* Comment Textarea */}
              <textarea
                id="comment"
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="5"
                placeholder="Escribe tu comentario aquí..."
                className="my-2 py-2 px-4 rounded-md bg-gray-900 text-gray-300 w-full outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              className="border-2 text-md mt-5 rounded-md py-2 px-4 bg-blue-600 hover:bg-blue-700 text-gray-100 transition duration-300 ease-in-out focus:outline-none focus:ring focus:ring-blue-600"
            >
              Enviar Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateReview;
