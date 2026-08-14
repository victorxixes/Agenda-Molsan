import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Interceptor para añadir token excepto en login
axios.interceptors.request.use((config) => {
  if (config.url.includes("/api/auth/login")) {
    return config;
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axios;
