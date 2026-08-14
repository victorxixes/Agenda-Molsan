import { create } from "zustand";
import { loginRequest } from "../api/auth_login";
import { usePermisosStore } from "./permisosStore";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,

  login: async (usuario, password, onSuccess) => {
    set({ loading: true, error: null });

    try {
      const data = await loginRequest(usuario, password);

      // 🔥 El backend devuelve "id", NO "empleado_id"
      const userData = {
        id: data.id,
        nombre: data.nombre,
        rol: data.rol || "empleado",
        foto: data.avatar_url || null,
      };

      set({ user: userData, loading: false });

      // 🔥 El backend devuelve "modulos_visibles" y "permisos_modulo"
      const permisosStore = usePermisosStore.getState();
      permisosStore.setModulos(data.modulos_visibles);
      permisosStore.setAcciones(data.permisos_modulo);

      if (onSuccess) onSuccess();

    } catch (err) {
      console.error("ERROR LOGIN:", err);
      set({ error: "Credenciales incorrectas", loading: false });
      alert("Error al iniciar sesión");
    }
  },

  logout: async () => {
    set({ user: null });
  },
}));
