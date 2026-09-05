import { create } from "zustand";
import { login } from "../api/auth";
import { obtenerFichaCompleta } from "../api/empleados";
import { API_BASE } from "../api/config";

export const useAuthStore = create((set) => ({
  empleado: null,
  token: null,

  iniciarSesion: async (usuario, password) => {
    try {
      const res = await login(usuario, password);
      console.log("LOGIN RES:", res.data);

      // Validación mínima
      if (!res.data || !res.data.token) {
        console.error("Login sin token");
        return false;
      }

      if (!res.data.empleado || !res.data.empleado.id) {
        console.error("Login sin empleado.id:", res.data);
        return false;
      }

      const empleadoId = res.data.empleado.id;

      // Cargar ficha completa del empleado
      const ficha = await obtenerFichaCompleta(empleadoId);
      console.log("FICHA COMPLETA:", ficha.data);

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
