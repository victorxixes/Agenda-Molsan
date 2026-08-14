import axios from "axios";

// Base URL del backend
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// ---------------------------------------------------------
// INTERCEPTOR PARA AÑADIR TOKEN AUTOMÁTICAMENTE
// ---------------------------------------------------------
axios.interceptors.request.use((config) => {
  // No añadir token en el login
  if (config.url.includes("/auth/login")) {
    return config;
  }

  // Leer token del localStorage
  const token = localStorage.getItem("token");

  // Si existe, añadirlo
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axios;
