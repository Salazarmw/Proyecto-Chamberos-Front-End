export const loginUser = async (formData) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error en el inicio de sesión");
    }

    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error; // Propagar el error para manejarlo en el componente
  }
};