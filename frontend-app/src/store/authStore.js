import { create } from "zustand";
import { login } from "../api/auth";
import { obtenerFichaCompleta } from "../api/empleados";
import { API_BASE } from "../api/config";

// Función para extraer el ID del JWT
function extraerIdDeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id; // tu JWT contiene "id"
  } catch {
    return null;
  }
}

export const useAuthStore = create((set) => ({
  empleado: null,
  token: null,

  iniciarSesion: async (usuario, password) => {
    try {
      const res = await login(usuario, password);
      console.log("LOGIN RES:", res.data);

      if (!res.data || !res.data.token) {
        console.error("Login sin token");
        return false;
      }

      // Intentar obtener el ID desde el empleado
      let empleadoId = res.data.empleado?.id;

      // Si no existe, obtenerlo desde el JWT
      if (!empleadoId) {
        empleadoId = extraerIdDeToken(res.data.token);
        console.log("ID extraído del JWT:", empleadoId);
      }

      if (!empleadoId) {
        console.error("No se pudo obtener empleado.id");
        return false;
      }

      // Cargar ficha completa
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
