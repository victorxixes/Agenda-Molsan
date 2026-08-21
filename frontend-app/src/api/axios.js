import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use((config) => {
  // Login va sin /api, aquí NO tocamos la URL
  if (config.url.startsWith("/auth/login")) {
    return config;
  }

  // El resto: si no empieza por /api, se lo añadimos
  if (!config.url.startsWith("/api")) {
    config.url = "/api" + config.url;
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axios;
