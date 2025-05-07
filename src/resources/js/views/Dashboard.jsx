import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import DropdownRegister from "./components/DropdownRegister";
import Card from "./components/Card";
import axios from "../config/axios";
import { AuthContext } from "../../../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [provinces, setProvinces] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [initialUsers, setInitialUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCanton, setSelectedCanton] = useState("");
  const [cantons, setCantons] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [provinceNames, setProvinceNames] = useState({});
  const [cantonNames, setCantonNames] = useState({});
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch provinces
        const provincesResponse = await axios.get("/api/provinces");
        setProvinces(provincesResponse.data);

        // Create a map of province IDs to names
        const provinceMap = {};
        provincesResponse.data.forEach((province) => {
          provinceMap[province._id] = province.name;
        });
        setProvinceNames(provinceMap);

        // Fetch tags
        const tagsResponse = await axios.get("/api/tags");
        setTags(tagsResponse.data);

        // Fetch users
        const usersResponse = await axios.get("/api/users", {
          params: {
            populate: "tags"
          }
        });
        
        // Filter only chambero type users
        const chamberos = usersResponse.data.filter(user => user.user_type === "chambero");
        
        setUsers(chamberos);
        setInitialUsers(chamberos);
        setFilteredUsers(chamberos);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle province change
  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedCanton("");

    if (provinceId) {
      try {
        const cantonsResponse = await axios.get(
          `/api/cantons/province/${provinceId}`
        );
        setCantons(cantonsResponse.data);

        // Create a map of canton IDs to names
        const cantonMap = {};
        cantonsResponse.data.forEach((canton) => {
          cantonMap[canton._id] = canton.name;
        });
        setCantonNames(cantonMap);

        // Update filtered users
        const filtered = users.filter(user => user.province === provinceId);
        setFilteredUsers(filtered);
      } catch (error) {
        console.error("Error fetching cantons:", error);
        setCantons([]);
      }
    } else {
      setCantons([]);
      setFilteredUsers(users);
    }
  };

  // Handle canton change
  const handleCantonChange = (e) => {
    const cantonId = e.target.value;
    setSelectedCanton(cantonId);

    if (cantonId) {
      const filtered = users.filter(user => user.canton === cantonId);
      setFilteredUsers(filtered);
    } else {
      const filtered = users.filter(user => user.province === selectedProvince);
      setFilteredUsers(filtered);
    }
  };

  // Handle real-time search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Handling tag changes
  const handleTagFilter = (tagId) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId];
      return newTags;
    });
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...users];

    // Filter by province
    if (selectedProvince) {
      filtered = filtered.filter((user) => user.province === selectedProvince);
    }

    // Filter by canton
    if (selectedCanton) {
      filtered = filtered.filter((user) => user.canton === selectedCanton);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((user) =>
        selectedTags.every((tagId) =>
          user.tags && user.tags.some((tag) => tag._id === tagId)
        )
      );
    }

    // Filter by tag search
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery) ||
          user.email.toLowerCase().includes(searchQuery) ||
          (user.tags &&
            user.tags.some((tag) =>
              tag.name.toLowerCase().includes(searchQuery)
            ))
      );
    }

    setFilteredUsers(filtered);
  }, [users, selectedProvince, selectedCanton, selectedTags, searchQuery]);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header with auth options for unauthenticated users */}
      {!user && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Bienvenido a Chamberos
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Encuentra el mejor servicio de chamberos para tu vehículo
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="bg-white text-indigo-600 px-6 py-2 rounded-md border border-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <div className="w-full lg:w-1/4 p-4 md:p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Filtros
          </h2>

          {/* Province */}
          <div className="mt-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Provincia
            </label>
            <select
              value={selectedProvince}
              onChange={handleProvinceChange}
              className="block w-full p-2.5 bg-white border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-700"
            >
              <option value="">Seleccione una provincia</option>
              {provinces.map((province) => (
                <option key={province._id} value={province._id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          {/* Canton */}
          <div className="mt-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Canton
            </label>
            <select
              value={selectedCanton}
              onChange={handleCantonChange}
              className="block w-full p-2.5 bg-white border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-700"
              disabled={!selectedProvince}
            >
              <option value="">Seleccione un canton</option>
              {cantons.map((canton) => (
                <option key={canton._id} value={canton._id}>
                  {canton.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="mb-4">
            <label
              htmlFor="searchJobs"
              className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
            >
              Buscar por nombre de servicio
            </label>
            <input
              id="searchJobs"
              type="text"
              placeholder="Escribe un servicio..."
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full p-2.5 bg-white border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-700"
            />
          </div>

          {/* Job List */}
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Servicios disponibles
          </h3>
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
            {tags && tags.length > 0 ? (
              tags.map((tag) => (
                <label key={tag._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag._id)}
                    onChange={() => handleTagFilter(tag._id)}
                    className="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-400"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {tag.name}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                No hay servicios disponibles.
              </p>
            )}
          </div>
        </div>

        {/* List of chamberos */}
        <div className="w-full lg:w-3/4 p-4 md:p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Perfiles de Chamberos
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Card
                  key={user._id}
                  user={user}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600 dark:text-gray-400">
                {selectedProvince || selectedCanton || selectedTags.length > 0 || searchQuery ? (
                  "No se encontraron chamberos con los filtros seleccionados."
                ) : (
                  "No hay chamberos registrados en el sistema."
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
