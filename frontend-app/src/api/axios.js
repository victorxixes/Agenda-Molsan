import axios from "axios";
import { useAuthStore } from "../store/authStore";

/**
 * Axios SJ‑2026 Premium
 * - BaseURL desde VITE_API_URL
 * - Token JWT automático desde authStore
 * - Manejo de errores de red
 */

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,   // Debe ser: https://agenda-intranet-b.onrender.com/api
  withCredentials: false,
});

/* ---------------------------------------------------------
   REQUEST INTERCEPTOR — TOKEN CORRECTO
--------------------------------------------------------- */
instance.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------------------------------------------------
   RESPONSE INTERCEPTOR
--------------------------------------------------------- */
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Error sin respuesta → servidor caído o red caída
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
