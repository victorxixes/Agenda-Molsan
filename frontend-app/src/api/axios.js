import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Interceptor para añadir token excepto en login
axios.interceptors.request.use((config) => {
  // login → NO añadir token
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
