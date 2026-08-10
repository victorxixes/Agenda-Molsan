import { create } from "zustand";
import { loginRequest } from "../api/auth";
import { usePermisosStore } from "./permisosStore";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (usuario, password, onSuccess) => {
    set({ loading: true, error: null });

    try {
      const data = await loginRequest(usuario, password);

      // Guardar usuario con los nombres CORRECTOS
      set({
        user: {
          id: data.id,
          nombre: data.nombre,
          rol: data.rol,
          avatar_url: data.avatar_url,
        },
        loading: false
      });

      // Guardar permisos con los nombres CORRECTOS
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

  logout: () => set({ user: null }),
}));
