import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Todas las rutas REST llevan /api
axios.interceptors.request.use((config) => {
  if (!config.url.startsWith("/api")) {
    config.url = "/api" + config.url;
  }

  if (config.url.startsWith("/api/auth/login")) {
    return config;
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axios;
