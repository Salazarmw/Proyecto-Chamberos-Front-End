import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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

  useEffect(() => {
    const fetchQuotationData = async () => {
      try {
        const response = await axios.get(`/api/quotations/${id}`);
        setQuotation(response.data);
        setFormData({
          service_description: response.data.service_description,
          price: response.data.price,
          scheduled_date: response.data.scheduled_date,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quotation data:", error);
        setLoading(false);
      }
    };

    fetchQuotationData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/quotations/${id}/counteroffer`, formData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating quotation:", error);
      alert("Error al enviar la contraoferta. Intente nuevamente.");
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Cargando...</div>;
  }

  if (!quotation) {
    return (
      <div className="container mx-auto p-6">Cotización no encontrada</div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Enviar Contraoferta
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="service_description"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-2"
          >
            Descripción del Servicio
          </label>
          <textarea
            id="service_description"
            name="service_description"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-200"
            rows="4"
            readOnly
            value={formData.service_description}
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-2"
          >
            Precio (₡)
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-200"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="scheduled_date"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-2"
          >
            Fecha Programada
          </label>
          <input
            type="date"
            id="scheduled_date"
            name="scheduled_date"
            value={formData.scheduled_date}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-200"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate("/dashboard")}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Enviar Contraoferta
          </button>
        </div>
      </form>
    </div>
  );
};

export default Counteroffer;
