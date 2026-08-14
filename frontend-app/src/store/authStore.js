import { create } from "zustand";
import { loginRequest } from "../api/auth_login";
import { usePermisosStore } from "./permisosStore";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  login: async (usuario, password, onSuccess) => {
    set({ loading: true, error: null });

    try {
      // Limpia sesión antes de iniciar
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const data = await loginRequest(usuario, password);

      const userData = {
        id: data.empleado_id,
        nombre: data.nombre,
        foto: data.foto || null,
      };

      set({
        user: userData,
        token: data.token,
        loading: false,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      const permisosStore = usePermisosStore.getState();
      permisosStore.setModulos(data.modulos);
      permisosStore.setAcciones(data.permisos);

      if (onSuccess) onSuccess();

    } catch (err) {
      console.error("ERROR LOGIN:", err);
      set({ error: "Credenciales incorrectas", loading: false });
      alert("Error al iniciar sesión");
    }
  },

  logout: () => {
    set({ user: null, token: null });

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    const permisosStore = usePermisosStore.getState();
    permisosStore.setModulos([]);
    permisosStore.setAcciones({});
  },
}));
