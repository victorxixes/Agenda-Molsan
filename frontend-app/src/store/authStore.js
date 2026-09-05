import { create } from "zustand";
import { login } from "../api/auth";
import { API_BASE } from "../api/config";

export const useAuthStore = create((set) => ({
  empleado: null,
  token: null,

  iniciarSesion: async (usuario, password) => {
    try {
      const res = await login(usuario, password);

      if (res.data.token && res.data.empleado) {
        const empleado = {
          ...res.data.empleado,
          foto: res.data.empleado.foto
            ? `${API_BASE}${res.data.empleado.foto}`
            : null,
        };

        set({
          empleado,
          token: res.data.token,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("empleado", JSON.stringify(empleado));

        return true;
      }

      return false;
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
