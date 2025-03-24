export const fetchProvinces = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/provinces");
    if (!response.ok) throw new Error("Error fetching provinces");
    return await response.json();
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
    return await response.json();
  } catch (error) {
    console.error("Error loading cantons:", error);
    return [];
  }
};
