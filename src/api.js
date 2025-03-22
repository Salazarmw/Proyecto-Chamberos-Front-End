import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Cambiar por URL del backend
});

export default api;
