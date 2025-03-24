export const loginUser = async (credentials) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error("Invalid credentials");

    return await response.json();
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};
