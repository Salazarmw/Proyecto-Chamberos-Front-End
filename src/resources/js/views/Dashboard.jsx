import { useState, useEffect } from "react";
import DropdownRegister from "./components/DropdownRegister";
import Card from "./components/Card";
import axios from "../config/axios";

export default function Dashboard() {
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
        const usersResponse = await axios.get("/api/users");
        setUsers(usersResponse.data);
        setInitialUsers(usersResponse.data);

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
      } catch (error) {
        console.error("Error fetching cantons:", error);
        setCantons([]);
      }
    } else {
      setCantons([]);
    }
  };

  // Handle real-time search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Handling tag changes
  const handleTagChange = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Apply filters
  const handleFilter = () => {
    let filtered = [...initialUsers];

    if (selectedProvince) {
      filtered = filtered.filter((user) => user.province === selectedProvince);
    }

    if (selectedCanton) {
      filtered = filtered.filter((user) => user.canton === selectedCanton);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((user) =>
        selectedTags.every(
          (tagId) => user.tags && user.tags.some((tag) => tag._id === tagId)
        )
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery) ||
          user.email.toLowerCase().includes(searchQuery)
      );
    }

    setUsers(filtered);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
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
              Cantón
            </label>
            <select
              value={selectedCanton}
              onChange={(e) => setSelectedCanton(e.target.value)}
              className="block w-full p-2.5 bg-white border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-700"
              disabled={!selectedProvince}
            >
              <option value="">Seleccione un cantón</option>
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
              Buscar trabajos
            </label>
            <input
              id="searchJobs"
              type="text"
              placeholder="Escribe un trabajo..."
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full p-2.5 bg-white border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-700"
            />
          </div>

          {/* Job List */}
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Trabajos
          </h3>
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
            {tags && tags.length > 0 ? (
              tags.map((tag) => (
                <label key={tag._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag._id)}
                    onChange={() => handleTagChange(tag._id)}
                    className="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-400"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {tag.description}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                No hay trabajos disponibles.
              </p>
            )}
          </div>

          {/* Filter button */}
          <button
            onClick={handleFilter}
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none"
          >
            Filtrar
          </button>
        </div>

        {/* List of chamberos */}
        <div className="w-full lg:w-3/4 p-4 md:p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Perfiles de Chamberos
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {users && users.length > 0 ? (
              users.map((user) => (
                <Card
                  key={user._id}
                  title={user.name}
                  description={user.email}
                  phone={user.phone || "Sin teléfono"}
                  province={provinceNames[user.province] || "Sin provincia"}
                  canton={cantonNames[user.canton] || "Sin cantón"}
                  address={user.address || "Sin dirección"}
                  profilePhoto={
                    user.profile_photo
                      ? `http://localhost:5000/${user.profile_photo}`
                      : "/storage/profile-photos/DefaultImage.jpeg"
                  }
                  userId={user._id}
                />
              ))
            ) : (
              <p className="col-span-full text-gray-700 dark:text-gray-300">
                No hay chamberos disponibles.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
