export const fetchProvinces = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/provinces");
    if (!response.ok) throw new Error("Error fetching provinces");
    const provinces = await response.json();
    return provinces.map((province) => ({
      value: province._id, // Use province ID as value
      label: province.name, // Use province name as label
    }));
  } catch (error) {
    console.error("Error loading provinces:", error);
    return [];
  }
};

export const fetchCantons = async (provinceId) => {
  if (!provinceId) return [];
  try {
    const response = await fetch(`http://localhost:5000/api/cantons/province/${provinceId}`);
    if (!response.ok) throw new Error("Error fetching cantons");
    const cantons = await response.json();
    return cantons.map((canton) => ({
      value: canton._id, // Use canton ID as value
      label: canton.name, // Use canton name as label
    }));
  } catch (error) {
    console.error("Error loading cantons:", error);
    return [];
  }
};