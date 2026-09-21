import { create } from "zustand";
import { login } from "../api/auth";
import { obtenerFichaCompleta } from "../api/empleados";
import { API_BASE } from "../api/config";

/**
 * Extrae el ID del empleado desde el JWT.
 */
function extraerIdDeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
}

/**
 * Store de Autenticación — Versión SJ‑2026 Ultra‑Stable
 */
export const useAuthStore = create((set) => ({
  empleado: null,
  token: null,
  loading: true,
  authReady: false,

  // ---------------------------------------------------------
  // MODAL PERFIL
  // ---------------------------------------------------------
  perfilModal: null,
  setPerfilModal: (id) => set({ perfilModal: id }),

  // ---------------------------------------------------------
  // HIDRACIÓN INICIAL — 🔥 TOKEN VALIDADO CONTRA BACKEND
  // ---------------------------------------------------------
  init: async () => {
    const token = localStorage.getItem("token");
    const empleadoLS = localStorage.getItem("empleado");

    // Si no hay token → no autenticado
    if (!token || !empleadoLS) {
      set({
        token: null,
        empleado: null,
        loading: false,
        authReady: true,
      });
      return;
    }

    // Intentar validar token contra backend
    try {
      const empleadoParsed = JSON.parse(empleadoLS);

      // Obtener ficha completa desde backend
      const ficha = await obtenerFichaCompleta(empleadoParsed.id);

      const empleado = {
        ...ficha.data.empleado,
        foto: ficha.data.empleado.foto
          ? `${API_BASE}${ficha.data.empleado.foto}`
          : null,
        modulos_visibles: ficha.data.modulos_visibles || [],
        permisos_modulo: ficha.data.permisos_modulo || {},
      };

      set({
        token,
        empleado,
        loading: false,
        authReady: true,
      });
    } catch (err) {
      // Si backend devuelve 401 → token inválido → logout automático
      console.warn("Token inválido, cerrando sesión automáticamente.");

      localStorage.removeItem("token");
      localStorage.removeItem("empleado");

      set({
        token: null,
        empleado: null,
        loading: false,
        authReady: true,
      });
    }
  },

  // ---------------------------------------------------------
  // INICIAR SESIÓN
  // ---------------------------------------------------------
  iniciarSesion: async (usuario, password) => {
    try {
      const res = await login(usuario, password);
      if (!res.data?.token) return false;

      let empleadoId =
        res.data.empleado?.id || extraerIdDeToken(res.data.token);

      if (!empleadoId) return false;

      const ficha = await obtenerFichaCompleta(empleadoId);

      const empleado = {
        ...ficha.data.empleado,
        foto: ficha.data.empleado.foto
          ? `${API_BASE}${ficha.data.empleado.foto}`
          : null,
        modulos_visibles: ficha.data.modulos_visibles || [],
        permisos_modulo: ficha.data.permisos_modulo || {},
      };

      set({
        empleado,
        token: res.data.token,
        loading: false,
        authReady: true,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("empleado", JSON.stringify(empleado));

      return true;
    } catch {
      return false;
    }
  },

  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------
  logout: () => {
    set({ empleado: null, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("empleado");
  },
}));
