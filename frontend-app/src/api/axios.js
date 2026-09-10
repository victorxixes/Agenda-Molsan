import axios from "axios";

const instance = axios.create({
  // ✔ baseURL correcta: tu backend expone /api, aquí lo añadimos una sola vez
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

// Interceptor de request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Blindaje total: nunca rompe el frontend
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
