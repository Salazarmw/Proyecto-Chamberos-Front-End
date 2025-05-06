import axios from "axios";

// Create axios instance with default config
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Axios - Token from localStorage:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Axios - Authorization header set:", config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    console.error("Axios - Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    console.log("Axios - Response received:", response);
    return response;
  },
  (error) => {
    console.error("Axios - Response error:", error);
    if (error.response && error.response.status === 401) {
      console.log("Axios - Unauthorized, removing token and redirecting");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
