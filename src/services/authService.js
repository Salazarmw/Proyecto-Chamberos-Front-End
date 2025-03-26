export const loginUser = async (formData) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token); // Guarda el token en localStorage
    return data;
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};