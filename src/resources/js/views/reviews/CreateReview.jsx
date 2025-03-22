import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CreateReview = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [job, setJob] = useState(null);
  const [toUser, setToUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { jobId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
    fetchJobData();
  }, [jobId]);

  const fetchJobData = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (response.ok) {
        const data = await response.json();
        setJob(data.job);
        setToUser(data.toUser);
      } else {
        console.error("Error al cargar datos del trabajo");
        navigate("/jobs");
      }
    } catch (error) {
      console.error("Error de red:", error);
      navigate("/jobs");
    }
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      alert("Por favor selecciona una calificación");
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment,
          to_user_id: toUser?.id,
          requested_job_id: job?.id,
        }),
      });

      if (response.ok) {
        navigate("/jobs");
      } else {
        alert("Ocurrió un error al guardar la review. Intente nuevamente.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de red. Verifique su conexión.");
    }
  };

  if (!job || !toUser || !currentUser) {
    return (
      <div className="h-screen bg-gray-800 flex justify-center items-center">
        <p className="text-white">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-800">
      <div className="pt-10 md:pt-20">
        <div className="p-4 md:p-8">
          <h1 className="text-white text-center pb-8 font-light text-4xl md:text-5xl lg:text-6xl">
            Deja tu Review
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="md:w-3/4 lg:w-2/3 xl:w-1/2">
              <div className="flex flex-col md:flex-row items-center">
                <img
                  src={currentUser.profile_photo || "/DefaultImage.jpeg"}
                  alt="Foto de perfil"
                  className="rounded-full w-16 h-16 mr-4"
                />
                <span className="my-2 py-2 px-4 rounded-md bg-gray-900 text-gray-300 w-full md:w-1/2 md:mr-2">
                  {currentUser.name} {currentUser.lastname}
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
                      className={`cursor-pointer ${
                        rating >= star ? "text-yellow-500" : "text-black"
                      } hover:text-yellow-500 star`}
                      data-value={star}
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
