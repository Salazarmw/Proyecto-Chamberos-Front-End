import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import { AuthContext } from "../../../../context/AuthContext";

const Quotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [filters, setFilters] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      fetchQuotations();
    }
  }, [filters, user]);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      let url = "/api/quotations";
      if (filters.length > 0) {
        url += `?filter=${filters.join(",")}`;
      }
      const response = await axios.get(url);
      console.log("Quotations response:", response.data); // Para depuración

      const filteredQuotations = response.data.filter((quotation) => {
        if (user.user_type === "client") {
          return quotation.client_id._id === user._id;
        } else if (user.user_type === "chambero") {
          return quotation.chambero_id._id === user._id;
        }
        return false;
      });

      console.log("Filtered quotations:", filteredQuotations); // Para depuración
      setQuotations(filteredQuotations);
      setError(null);
    } catch (error) {
      console.error("Error fetching quotations:", error);
      setError("Error al cargar las cotizaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setFilters((prev) => [...prev, value]);
    } else {
      setFilters((prev) => prev.filter((filter) => filter !== value));
    }
  };

  const handleAction = async (action, quotationId) => {
    try {
      if (action === "counteroffer") {
        navigate(`/quotations/${quotationId}/counteroffer`);
        return;
      }

      const response = await axios.put(
        `/api/quotations/${quotationId}/status`,
        {
          status: action,
        }
      );

      if (response.status === 200 || response.status === 201) {
        await fetchQuotations();
      }
    } catch (error) {
      console.error("Error handling action:", error);
      alert("Error al procesar la acción. Por favor, intente nuevamente.");
    }
  };

  const formatMoney = (amount) => {
    return (
      "₡" +
      Number(amount).toLocaleString("es-CR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-CR");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 dark:text-yellow-400";
      case "accepted":
        return "text-green-600 dark:text-green-400";
      case "rejected":
        return "text-red-600 dark:text-red-400";
      case "offer":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "accepted":
        return "Aceptada";
      case "rejected":
        return "Rechazada";
      case "offer":
        return "Contraoferta";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="text-gray-600 dark:text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Cotizaciones
      </h1>
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* Filters container */}
        <div className="w-full lg:w-1/4 bg-white dark:bg-gray-800 shadow rounded-lg p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Filtrar Cotizaciones
          </h2>
          <form className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="filter1"
                value="pending"
                className="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-400"
                checked={filters.includes("pending")}
                onChange={handleFilterChange}
              />
              <label
                htmlFor="filter1"
                className="ml-2 text-gray-700 dark:text-gray-300"
              >
                Pendientes
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="filter4"
                value="offer"
                className="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-400"
                checked={filters.includes("offer")}
                onChange={handleFilterChange}
              />
              <label
                htmlFor="filter4"
                className="ml-2 text-gray-700 dark:text-gray-300"
              >
                Contraofertas
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="filter2"
                value="accepted"
                className="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-400"
                checked={filters.includes("accepted")}
                onChange={handleFilterChange}
              />
              <label
                htmlFor="filter2"
                className="ml-2 text-gray-700 dark:text-gray-300"
              >
                Aceptadas
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="filter3"
                value="rejected"
                className="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-400"
                checked={filters.includes("rejected")}
                onChange={handleFilterChange}
              />
              <label
                htmlFor="filter3"
                className="ml-2 text-gray-700 dark:text-gray-300"
              >
                Rechazadas
              </label>
            </div>
          </form>
        </div>

        {/* Quotations table */}
        <div className="w-full lg:w-3/4 bg-white dark:bg-gray-800 shadow rounded-lg p-4 md:p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Descripción
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Precio
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {quotations.length > 0 ? (
                quotations.map((quotation) => (
                  <tr
                    key={quotation._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                      {quotation.service_description}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                      {formatDate(quotation.scheduled_date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                      {formatMoney(quotation.price)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium capitalize">
                      <span className={getStatusColor(quotation.status)}>
                        {getStatusText(quotation.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.user_type === "chambero" &&
                        quotation.status === "pending" && (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                handleAction("accepted", quotation._id)
                              }
                              className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                            >
                              Aceptar
                            </button>
                            <button
                              onClick={() =>
                                handleAction("rejected", quotation._id)
                              }
                              className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                            >
                              Rechazar
                            </button>
                            <button
                              onClick={() =>
                                handleAction("counteroffer", quotation._id)
                              }
                              className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded"
                            >
                              Contra Oferta
                            </button>
                          </div>
                        )}
                      {user.user_type === "client" &&
                        quotation.status === "offer" && (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                handleAction("accepted", quotation._id)
                              }
                              className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                            >
                              Aceptar
                            </button>
                            <button
                              onClick={() =>
                                handleAction("rejected", quotation._id)
                              }
                              className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                            >
                              Rechazar
                            </button>
                          </div>
                        )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-3 text-center text-gray-600 dark:text-gray-400"
                  >
                    No hay cotizaciones disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Quotations;
