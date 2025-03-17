import { useState, useEffect, useCallback } from "react";
import AppLayout from "./layouts/AppLayout";
import DropdownRegister from "./components/DropdownRegister";
import Card from "./components/Card";

export default function Dashboard({
  initialProvinces,
  initialTags,
  initialUsers,
}) {
  const [provinces] = useState(initialProvinces); // Eliminamos setProvinces
  const [tags, setTags] = useState(initialTags);
  const [users] = useState(initialUsers); // Eliminamos setUsers
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCanton, setSelectedCanton] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [cantons, setCantons] = useState([]);

  // Manejar cambio de provincia
  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedCanton("");

    if (provinceId) {
      try {
        const response = await fetch(`/api/get-cantons/${provinceId}`);
        const data = await response.json();
        setCantons(data);
      } catch (error) {
        console.error("Error fetching cantons:", error);
      }
    } else {
      setCantons([]);
    }
  };

  // Manejar búsqueda en tiempo real
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = tags.filter((tag) =>
      tag.description.toLowerCase().includes(query)
    );
    setTags(filtered);
  };

  // Aplicar filtros (memoizado con useCallback)
  const applyFilters = useCallback(() => {
    let filtered = users;

    if (selectedProvince) {
      filtered = filtered.filter((user) => user.province === selectedProvince);
    }

    if (selectedCanton) {
      filtered = filtered.filter((user) => user.canton === selectedCanton);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((user) =>
        selectedTags.every((tag) => user.tags.includes(tag))
      );
    }

    setFilteredUsers(filtered);
  }, [selectedProvince, selectedCanton, selectedTags, users]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <AppLayout header={<h1>Perfiles de Chamberos</h1>}>
      <div className="container mx-auto flex space-x-6">
        {/* Filtros */}
        <div className="w-1/4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md h-full">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Filtros
          </h2>

          {/* Provincia */}
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

          {/* Cantón */}
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

          {/* Búsqueda */}
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

          {/* Lista de trabajos */}
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Trabajos
          </h3>
          <div id="jobsList" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={tag.id}
                  checked={selectedTags.includes(tag.id)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedTags((prev) =>
                      prev.includes(value)
                        ? prev.filter((t) => t !== value)
                        : [...prev, value]
                    );
                  }}
                  className="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-400"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {tag.description}
                </span>
              </label>
            ))}
          </div>

          {/* Botón de filtrar */}
          <button
            onClick={applyFilters}
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none"
          >
            Filtrar
          </button>
        </div>

        {/* Lista de chamberos */}
        <div className="w-3/4 p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Perfiles de Chamberos
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
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
    </AppLayout>
  );
}
