export const resendVerificationEmail = async (email) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/resend-verification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error resending verification email");
    }

    return data;
  } catch (error) {
    console.error("Error resending verification email:", error);
    throw error;
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/verify-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error verifying email");
    }

    return data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};
