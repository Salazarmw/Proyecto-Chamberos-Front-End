import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import { AuthContext } from "../../../../context/AuthContext";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user, selectedStatuses]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (selectedStatuses.length > 0) {
        selectedStatuses.forEach(status => {
          queryParams.append('status[]', status);
        });
      }

      const url = `/api/jobs?${queryParams.toString()}`;
      const response = await axios.get(url);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError(error.response?.data?.message || "Error loading jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedStatuses((prev) => [...prev, value]);
    } else {
      setSelectedStatuses((prev) => prev.filter((status) => status !== value));
    }
  };

  const handleApproveJob = async (jobId) => {
    try {
      await axios.post(`/api/jobs/${jobId}/approve`, {
        user_type: user.user_type
      });
      await fetchJobs();
    } catch (error) {
      console.error("Error approving job:", error);
    }
  };

  const handleJobAction = async (action, jobId) => {
    try {
      if (action === "approve") {
        await handleApproveJob(jobId);
      } else if (action === "review") {
        navigate(`/reviews/${jobId}`);
      }
    } catch (error) {
      console.error("Error handling job action:", error);
      setError(error.response?.data?.message || "Error al procesar la acción");
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case "in_progress":
        return "En progreso";
      case "completed":
        return "Completado";
      case "failed":
        return "Fallido";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in_progress":
        return "text-yellow-600 dark:text-yellow-400";
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "failed":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Trabajos
      </h1>
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* Filters container */}
        <div className="w-full lg:w-1/4 bg-white dark:bg-gray-800 shadow rounded-lg p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Filtrar Trabajos
          </h2>
          <form className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="filter1"
                value="in_progress"
                className="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-400"
                checked={selectedStatuses.includes("in_progress")}
                onChange={handleFilterChange}
              />
              <label
                htmlFor="filter1"
                className="ml-2 text-gray-700 dark:text-gray-300"
              >
                En Progreso
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="filter2"
                value="completed"
                className="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-400"
                checked={selectedStatuses.includes("completed")}
                onChange={handleFilterChange}
              />
              <label
                htmlFor="filter2"
                className="ml-2 text-gray-700 dark:text-gray-300"
              >
                Completados
              </label>
            </div>
          </form>
        </div>

        {/* Jobs list container */}
        <div className="w-full lg:w-3/4 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Chambero
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <tr
                      key={job._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {job.quotation_id?.service_description || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {job.status === "in_progress" ? "En Progreso" : "Completado"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {job.client_id?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {job.chambero_id?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {job.status === "in_progress" && (
                          <div className="flex flex-wrap gap-2">
                            {/* Mostrar el estado de aprobación */}
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {user.user_type === "client" ? (
                                job.client_ok ? "✓ Aprobado" : "Pendiente de tu aprobación"
                              ) : (
                                job.chambero_ok ? "✓ Aprobado" : "Pendiente de tu aprobación"
                              )}
                            </div>
                            
                            {/* Botón de aprobar si aún no ha aprobado */}
                            {((user.user_type === "client" && !job.client_ok) ||
                              (user.user_type === "chambero" && !job.chambero_ok)) && (
                              <button
                                onClick={() => handleApproveJob(job._id)}
                                className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                              >
                                Aprobar Trabajo
                              </button>
                            )}
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
                      No hay trabajos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;

