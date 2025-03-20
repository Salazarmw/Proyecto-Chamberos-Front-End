// src/services/authService.js

export async function getUser() {
  try {
    const response = await fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Not authenticated");

    return await response.json();
  } catch (error) {
    return null;
  }
}
