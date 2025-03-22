import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    status: [],
  });
  const user = JSON.parse(localStorage.getItem("user")) || { user_type: "" };
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      // Construir query params para filtros
      const queryParams = new URLSearchParams();
      if (filters.status.length > 0) {
        filters.status.forEach((status) => {
          queryParams.append("status[]", status);
        });
      }

      const response = await fetch(`/api/jobs?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        console.error("Error al cargar trabajos");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "status[]") {
      if (checked) {
        setFilters((prev) => ({
          ...prev,
          status: [...prev.status, value],
        }));
      } else {
        setFilters((prev) => ({
          ...prev,
          status: prev.status.filter((status) => status !== value),
        }));
      }
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleJobAction = async (action, jobId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content"),
        },
        body: JSON.stringify({
          action,
        }),
      });

      if (response.ok) {
        navigate(`/reviews/create/${jobId}`);
      } else {
        alert("Ocurrió un error. Intente nuevamente.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de red. Verifique su conexión.");
    }
  };

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
  };

  return (
    <div className="container mx-auto p-6">
      <meta name="csrf-token" content="" />{" "}
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Trabajos
      </h1>
      <div className="flex gap-6">
        {/* Filters */}
        <div className="w-1/4 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Filtrar trabajos
          </h2>
          <form onSubmit={handleFilterSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="status[]"
                value="failed"
                checked={filters.status.includes("failed")}
                onChange={handleFilterChange}
                className="form-checkbox h-5 w-5 text-red-600 dark:text-red-400"
              />
              <span className="text-gray-700 dark:text-gray-300">Failed</span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="status[]"
                value="in_progress"
                checked={filters.status.includes("in_progress")}
                onChange={handleFilterChange}
                className="form-checkbox h-5 w-5 text-yellow-600 dark:text-yellow-400"
              />
              <span className="text-gray-700 dark:text-gray-300">
                In Progress
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="status[]"
                value="completed"
                checked={filters.status.includes("completed")}
                onChange={handleFilterChange}
                className="form-checkbox h-5 w-5 text-green-600 dark:text-green-400"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Completed
              </span>
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none"
            >
              Filtrar
            </button>
          </form>
        </div>

        {/* Jobs table */}
        <div className="w-3/4 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                  Trabajo ID
                </th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                  Descripción
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
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-gray-300 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-blue-600"
                  >
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200">
                      {job.id}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200">
                      {job.quotation?.service_description || "Sin descripción"}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200 capitalize">
                      {formatStatus(job.status)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                      {job.status === "in_progress" && (
                        <div className="flex gap-2">
                          {user.user_type === "client" &&
                            job.client_ok !== "success" &&
                            job.chambero_ok === "success" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleJobAction("success", job.id)
                                  }
                                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
                                >
                                  Terminar
                                </button>
                                <button
                                  onClick={() =>
                                    handleJobAction("failed", job.id)
                                  }
                                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                                >
                                  Cancelar
                                </button>
                              </>
                            )}

                          {user.user_type === "chambero" &&
                            job.chambero_ok !== "success" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleJobAction("success", job.id)
                                  }
                                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
                                >
                                  Terminar
                                </button>
                                <button
                                  onClick={() =>
                                    handleJobAction("failed", job.id)
                                  }
                                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-4 text-gray-600 dark:text-gray-400"
                  >
                    No hay trabajos disponibles
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

export default Jobs;
