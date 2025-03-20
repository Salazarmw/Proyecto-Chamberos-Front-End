import { useState, useEffect } from "react";
import DropdownRegister from "./components/DropdownRegister";
import Card from "./components/Card";

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

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch provinces
        const provincesResponse = await fetch("/api/provinces");
        const provincesData = await provincesResponse.json();
        setProvinces(provincesData);

        // Fetch tags
        const tagsResponse = await fetch("/api/tags");
        const tagsData = await tagsResponse.json();
        setTags(tagsData);

        // Fetch users
        const usersResponse = await fetch("/api/users");
        const usersData = await usersResponse.json();
        setUsers(usersData);
        setInitialUsers(usersData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle province change
  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedCanton("");

    if (provinceId) {
      fetch(`/api/get-cantons/${provinceId}`)
        .then((response) => response.json())
        .then((data) => {
          setCantons(data);
        })
        .catch((error) => {
          console.error("Error fetching cantons:", error);
          setCantons([]);
        });
    } else {
      setCantons([]);
    }
  };

  // Handle real-time search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Handling label changes
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
          (tagId) => user.tags && user.tags.some((tag) => tag.id === tagId)
        )
      );
    }

    setUsers(filtered);
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = tags.filter((tag) =>
        tag.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTags(filtered);
    } else {
      fetch("/api/tags")
        .then((response) => response.json())
        .then((data) => {
          setTags(data);
        })
        .catch((error) => {
          console.error("Error resetting tags:", error);
        });
    }
  }, [searchQuery]);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto flex space-x-6">
      {/* Filters */}
      <div className="w-1/4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md h-full">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Filtros
        </h2>

        {/* Province */}
        <div className="mt-4">
          <DropdownRegister
            id="province"
            name="province"
            label="Province"
            options={provinces}
            value={selectedProvince}
            onChange={handleProvinceChange}
            required
          />
        </div>

        {/* Canton */}
        <div className="mt-4">
          <DropdownRegister
            id="canton"
            name="canton"
            label="Canton"
            options={cantons}
            value={selectedCanton}
            onChange={(e) => setSelectedCanton(e.target.value)}
            required
          />
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
        <div id="jobsList" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tags && tags.length > 0 ? (
            tags.map((tag) => (
              <label key={tag.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={tag.id}
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
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
      <div className="w-3/4 p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Perfiles de Chamberos
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {users && users.length > 0 ? (
            users.map((user) => (
              <Card
                key={user.id}
                title={user.name}
                description={user.email}
                phone={user.phone || "Sin teléfono"}
                province={user.province || "Sin provincia"}
                canton={user.canton || "Sin cantón"}
                address={user.address || "Sin dirección"}
                profilePhoto={
                  user.profile_photo || "profile-photos/DefaultImage.jpeg"
                }
                userId={user.id}
              />
            ))
          ) : (
            <p className="col-span-3 text-gray-700 dark:text-gray-300">
              No hay chamberos disponibles.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
