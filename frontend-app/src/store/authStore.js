import { create } from "zustand";
import { login } from "../api/auth";
import { obtenerFichaCompleta } from "../api/empleados";
import { API_BASE } from "../api/config";

function extraerIdDeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
}

export const useAuthStore = create((set) => ({
  empleado: null,
  token: null,
  loading: true,        // ← CLAVE
  authReady: false,     // ← CLAVE

  // 🔥 HIDRACIÓN INICIAL
  init: () => {
    const token = localStorage.getItem("token");
    const empleado = localStorage.getItem("empleado");

    if (token && empleado) {
      set({
        token,
        empleado: JSON.parse(empleado),
        loading: false,
        authReady: true,
      });
    } else {
      set({
        token: null,
        empleado: null,
        loading: false,
        authReady: true,
      });
    }
  },

  iniciarSesion: async (usuario, password) => {
    try {
      const res = await login(usuario, password);
      if (!res.data?.token) return false;

      let empleadoId = res.data.empleado?.id || extraerIdDeToken(res.data.token);

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

    } catch (err) {
      console.error("Error login:", err);
      return false;
    }
  },

  logout: () => {
    set({ empleado: null, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("empleado");
  },
}));
