export const fetchProvinces = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/provinces");
    if (!response.ok) throw new Error("Error fetching provinces");
    const provinces = await response.json();
    return provinces.map((province) => ({
      value: province._id, // Usar el ID como valor
      label: province.name, // Usar el nombre como etiqueta
    }));
  } catch (error) {
    console.error("Error loading provinces:", error);
    return [];
  }
};

export const fetchCantons = async (provinceId) => {
  if (!provinceId) return [];
  try {
    const response = await fetch(`http://localhost:5000/api/cantons/${provinceId}`);
    if (!response.ok) throw new Error("Error fetching cantons");
    const cantons = await response.json();
    console.log("Cantons fetched from API:", cantons); // Log para depurar
    return cantons.map((canton) => ({
      value: canton._id, // Usar el ID del cantón como valor
      label: canton.name, // Usar el nombre del cantón como etiqueta
    }));
  } catch (error) {
    console.error("Error loading cantons:", error);
    return [];
  }
};