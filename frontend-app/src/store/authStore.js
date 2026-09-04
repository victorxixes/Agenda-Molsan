import { create } from "zustand";
import { login } from "../api/auth";

export const useAuthStore = create((set) => ({
  empleado: null,

  iniciarSesion: async (usuario, password) => {
    const res = await login(usuario, password);

    if (res.data.status === "ok") {
      set({ empleado: res.data.empleado });
      return true;
    }

    return false;
  },
}));

