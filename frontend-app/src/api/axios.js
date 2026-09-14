import axios from "axios";

const base = import.meta.env.VITE_API_URL;

// 🔥 Elimina /api si el usuario lo puso por error
const cleanBase = base.replace(/\/api$/, "");

const instance = axios.create({
  baseURL: cleanBase,      // 🔥 sin /api
  withCredentials: false,  // 🔥 Render bloquea cookies cross-domain
});

// Interceptor de request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        status: 500,
        data: null,
        message: "Error de red o servidor no disponible",
      });
    }
    return Promise.reject(error);
  }
);

export default instance;
