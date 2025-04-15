import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import { AuthContext } from "../../../../context/AuthContext";

const CreateQuotation = () => {
  const { chamberoId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chambero, setChambero] = useState(null);
  const [formData, setFormData] = useState({
    service_description: "",
    scheduled_date: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChamberoData = async () => {
      try {
        const response = await axios.get(`/api/users/${chamberoId}`);
        setChambero(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chambero data:", error);
        setError("Error al cargar los datos del chambero");
        setLoading(false);
      }
    };

    if (!user) {
      setError("Debe iniciar sesión para crear una cotización");
      setLoading(false);
      return;
    }

    fetchChamberoData();
  }, [chamberoId, user]);

  const handleChange = (e) => {
    if (e.target.name === "price") {
      const value = e.target.value.replace(/[^0-9]/g, "");
      const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      e.target.value = formattedValue;
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const price = parseInt(formData.price.replace(/,/g, ""));
      const quotationData = {
        client_id: user.id,
        chambero_id: chamberoId,
        service_description: formData.service_description,
        scheduled_date: formData.scheduled_date,
        price: price,
        status: "pending"
      };

      const response = await axios.post("/api/quotations", quotationData);
      navigate("/quotations");
    } catch (error) {
      console.error("Error creating quotation:", error);
      setError(error.response?.data?.message || "Error creating quotation");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto flex justify-center p-6">
        <div className="text-gray-600 dark:text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex justify-center p-6">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  if (!chambero) {
    return (
      <div className="container mx-auto flex justify-center p-6">
        <div className="text-gray-600 dark:text-gray-400">
          Chambero no encontrado
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={
              chambero.profile_photo
                ? `http://localhost:5000/${chambero.profile_photo}`
                : "/storage/profile-photos/DefaultImage.jpeg"
            }
            alt="Profile Photo"
            className="w-16 h-16 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/storage/profile-photos/DefaultImage.jpeg";
            }}
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {chambero.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {chambero.email}
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <p>
            <strong>Teléfono:</strong> {chambero.phone || "Sin teléfono"}
          </p>
          <p>
            <strong>Provincia:</strong> {chambero.province || "Sin provincia"}
          </p>
          <p>
            <strong>Cantón:</strong> {chambero.canton || "Sin cantón"}
          </p>
          <p>
            <strong>Dirección:</strong> {chambero.address || "Sin dirección"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Work Details */}
          <div className="mb-4">
            <label
              htmlFor="work_details"
              className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
            >
              Detalles del trabajo:
            </label>
            <textarea
              id="work_details"
              name="service_description"
              rows="4"
              className="block w-full p-2.5 bg-white border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-700"
              placeholder="Ingrese los detalles del trabajo"
              value={formData.service_description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Date */}
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
            >
              Fecha del trabajo:
            </label>
            <input
              type="date"
              id="date"
              name="scheduled_date"
              className="block w-full p-2.5 bg-white border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-700"
              min={today}
              value={formData.scheduled_date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Offered Money */}
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
            >
              Dinero ofrecido en ₡:
            </label>
            <input
              type="text"
              id="price"
              name="price"
              className="block w-full p-2.5 bg-white border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-700"
              placeholder="Ingrese el dinero ofrecido"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="w-5/12 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Enviar Cotización
            </button>
            <button
              type="button"
              className="w-5/12 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              onClick={() => navigate("/dashboard")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuotation;
