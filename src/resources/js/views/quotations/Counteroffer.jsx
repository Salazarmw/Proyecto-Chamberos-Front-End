import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axios";

const Counteroffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);
  const [formData, setFormData] = useState({
    service_description: "",
    price: "",
    scheduled_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      console.error("Quotation ID is undefined");
      setError("No se pudo identificar la cotización seleccionada.");
      setLoading(false);
      return;
    }

    const fetchQuotation = async () => {
      try {
        const response = await axios.get(`/api/quotations/${id}`);
        setQuotation(response.data);

        const date = new Date(response.data.scheduled_date);
        const formattedDate = date.toISOString().split("T")[0];

        setFormData({
          service_description: response.data.service_description,
          price: response.data.price.toString(),
          scheduled_date: formattedDate,
        });
        setError(null);
      } catch (error) {
        console.error("Error fetching quotation:", error);
        setError("Error al cargar los datos de la cotización");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotation();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      const numericValue = value.replace(/[^0-9,]/g, "");
      const cleanValue = numericValue.replace(/,/g, "");
      const formattedValue = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const price = parseInt(formData.price.replace(/,/g, ""));
      const response = await axios.put(`/api/quotations/${id}/status`, {
        status: "counteroffer",
        price: price,
        service_description: formData.service_description,
        scheduled_date: formData.scheduled_date
      });
      navigate("/quotations");
    } catch (error) {
      console.error("Error updating quotation:", error);
      setError(
        error.response?.data?.message ||
          "Error al actualizar la cotización. Por favor, verifique los datos."
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            Cargando...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="text-center text-red-600 dark:text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            Cotización no encontrada
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Enviar Contraoferta
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="original_service_description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Descripción original del servicio
            </label>
            <textarea
              id="original_service_description"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              rows="3"
              value={quotation.service_description}
              readOnly
            />
          </div>

          <div>
            <label
              htmlFor="service_description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Nota de la contraoferta
            </label>
            <textarea
              id="service_description"
              name="service_description"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
              rows="3"
              value={formData.service_description}
              onChange={handleChange}
              placeholder="Agrega una nota para el cliente (opcional)"
            />
          </div>

          <div>
            <label
              htmlFor="scheduled_date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Fecha Programada
            </label>
            <input
              type="date"
              id="scheduled_date"
              name="scheduled_date"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
              value={formData.scheduled_date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Precio (₡)
            </label>
            <input
              type="text"
              id="price"
              name="price"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
              value={formData.price}
              onChange={handleChange}
              placeholder="Ingrese el precio"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={() => navigate("/quotations")}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Enviar Contraoferta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Counteroffer;
