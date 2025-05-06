import { useState, useEffect } from "react";
import axios from "../config/axios";

const WorkGallery = ({ userId, isOwner }) => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [description, setDescription] = useState("");

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}/gallery`);
      setGallery(response.data.gallery || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      setError("Error al cargar la galería");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [userId]);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!newImage) return;

    const formData = new FormData();
    formData.append("image", newImage);
    formData.append("description", description);

    try {
      await axios.post(`/api/users/${userId}/gallery`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setNewImage(null);
      setDescription("");
      fetchGallery();
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Error al subir la imagen");
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await axios.delete(`/api/users/${userId}/gallery/${imageId}`);
      fetchGallery();
    } catch (error) {
      console.error("Error deleting image:", error);
      setError("Error al eliminar la imagen");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
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
    <div className="space-y-6">
      {/* Formulario de subida (solo para el propietario) */}
      {isOwner && (
        <form onSubmit={handleImageUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nueva imagen
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files[0])}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                dark:file:bg-indigo-900 dark:file:text-indigo-300
                hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 
                shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Describe el trabajo realizado"
            />
          </div>
          <button
            type="submit"
            disabled={!newImage}
            className="inline-flex justify-center py-2 px-4 border border-transparent 
              shadow-sm text-sm font-medium rounded-md text-white 
              bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
              focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Subir imagen
          </button>
        </form>
      )}

      {/* Galería de imágenes */}
      {gallery.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gallery.map((item) => (
            <div
              key={item._id}
              className="relative group rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={item.image_url}
                alt={item.description || "Imagen de trabajo"}
                className="w-full h-48 object-cover"
              />
              {item.description && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                  <p className="text-sm">{item.description}</p>
                </div>
              )}
              {isOwner && (
                <button
                  onClick={() => handleDeleteImage(item._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full 
                    opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <p>No hay imágenes en la galería</p>
        </div>
      )}
    </div>
  );
};

export default WorkGallery; 