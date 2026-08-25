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
      const data = await loginRequest(usuario, password);

      const empleado = data.empleado;

      const userData = {
        id: empleado.id,
        nombre: empleado.nombre,
        usuario: empleado.usuario,
        rol_id: empleado.rol_id,
        rol_nombre: empleado.rol_nombre,
        foto: empleado.foto || null,
      };

      set({
        user: userData,
        token: data.token,
        loading: false,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      const permisosStore = usePermisosStore.getState();
      permisosStore.setModulos(empleado.modulos_visibles);
      permisosStore.setAcciones(empleado.permisos_modulo);

      onSuccess && onSuccess();

    } catch (err) {
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
