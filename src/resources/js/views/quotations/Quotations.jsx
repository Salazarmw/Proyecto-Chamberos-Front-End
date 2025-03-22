import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";

const Quotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [filters, setFilters] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuotations();
  }, [filters]);

  const fetchQuotations = async () => {
    try {
      let url = "/api/quotations";
      if (filters.length > 0) {
        url += `?filter=${filters.join(",")}`;
      }
      const response = await axios.get(url);
      setQuotations(response.data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setFilters([...filters, value]);
    } else {
      setFilters(filters.filter((filter) => filter !== value));
    }
  };

  const handleAction = async (action, quotationId) => {
    if (action === "counteroffer") {
      navigate(`/quotations/${quotationId}/counteroffer`);
      return;
    }

    try {
      const response = await axios.post(
        `/api/quotations/${quotationId}/${action}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document
              .querySelector('meta[name="csrf-token"]')
              .getAttribute("content"),
          },
        }
      );

      if (response.status === 200) {
        fetchQuotations();
      } else {
        alert("Ocurrió un error. Intente nuevamente.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de red. Verifique su conexión.");
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Cotizaciones
      </h1>
      <div className="flex gap-6">
        {/* Filters container */}
        <div className="w-1/4 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Filtrar Cotizaciones
          </h2>
          <form id="filters-form">
            <div className="mb-4">
              <input
                type="checkbox"
                id="filter1"
                name="filter[]"
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
            <div className="mb-4">
              <input
                type="checkbox"
                id="filter4"
                name="filter[]"
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
            <div className="mb-4">
              <input
                type="checkbox"
                id="filter2"
                name="filter[]"
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
            <div className="mb-4">
              <input
                type="checkbox"
                id="filter3"
                name="filter[]"
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
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={fetchQuotations}
            >
              Aplicar Filtros
            </button>
          </form>
        </div>

        {/* Quotations table */}
        <div className="w-3/4 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                  ID
                </th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                  Descripción
                </th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                  Fecha Programada
                </th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                  Precio
                </th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                  Estado
                </th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {quotations.length > 0 ? (
                quotations.map((quotation) => (
                  <tr
                    key={quotation.id}
                    className="border-b border-gray-300 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-blue-600"
                  >
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200">
                      {quotation.id}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200">
                      {quotation.service_description}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200">
                      {quotation.scheduled_date}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200">
                      {formatMoney(quotation.price)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200 capitalize">
                      {quotation.status}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                      {user.user_type === "chambero" &&
                        quotation.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleAction("accept", quotation.id)
                              }
                              className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
                            >
                              Aceptar
                            </button>
                            <button
                              onClick={() =>
                                handleAction("reject", quotation.id)
                              }
                              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                            >
                              Rechazar
                            </button>
                            <button
                              onClick={() =>
                                handleAction("counteroffer", quotation.id)
                              }
                              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded"
                            >
                              Contra Oferta
                            </button>
                          </div>
                        )}
                      {user.user_type === "client" &&
                        quotation.status === "offer" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleAction("accept", quotation.id)
                              }
                              className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
                            >
                              Aceptar
                            </button>
                            <button
                              onClick={() =>
                                handleAction("reject", quotation.id)
                              }
                              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
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
                    colSpan="6"
                    className="text-center py-4 text-gray-600 dark:text-gray-400"
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
