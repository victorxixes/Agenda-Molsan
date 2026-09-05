import { create } from "zustand";
import axios from "axios";

const API = "https://agenda-intranet-b.onrender.com/api";

export const useAuthStore = create((set) => ({
  empleado: null,
  token: null,

  iniciarSesion: async (usuario, password) => {
    try {
      const res = await axios.post(`${API}/auth/login`, {
        usuario,
        password
      });

      if (res.data.status === "ok") {
        set({
          empleado: res.data.empleado,
          token: res.data.token
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
  }
}));
