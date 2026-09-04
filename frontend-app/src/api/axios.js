import axios from "axios";

/* ============================================
   ERP SJ‑2026 — Cliente Axios centralizado
   ============================================ */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================================
   INTERCEPTOR — Añadir token automáticamente
   ============================================ */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ============================================
   INTERCEPTOR — Manejo de errores global
   ============================================ */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Si el token expira → redirigir al login
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default api;
