import { create } from "zustand";
import { login } from "../api/auth";

export const useAuthStore = create((set) => ({
  empleado: null,
  token: null,

  iniciarSesion: async (usuario, password) => {
    try {
      const res = await login(usuario, password);

      // VALIDACIÓN REAL SEGÚN TU BACKEND
      if (res.data.token && res.data.empleado) {
        set({
          empleado: res.data.empleado,
          token: res.data.token,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("empleado", JSON.stringify(res.data.empleado));

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
