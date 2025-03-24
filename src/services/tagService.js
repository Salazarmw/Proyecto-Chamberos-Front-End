export const fetchTags = async (setAvailableTags) => {
  try {
    const response = await fetch("/api/tags");
    if (response.ok) {
      const data = await response.json();
      setAvailableTags(data);
    }
  } catch (error) {
    console.error("Error loading tags:", error);
  }
};
