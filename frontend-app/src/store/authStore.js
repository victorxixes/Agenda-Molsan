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
      // 🔥 Petición al backend
      const data = await loginRequest(usuario, password);

      // 🔥 El backend devuelve:
      // empleado_id, nombre, foto, modulos, permisos, token
      const userData = {
        id: data.usuario_id,
        nombre: data.nombre,
        usuario: usuario, // el backend no lo devuelve
        foto: data.foto || null,

        // Opcional: si tu backend añade rol en el futuro
        rol_id: data.rol_id || 1,
        rol_nombre: data.rol_nombre || "Administrador",
      };

      // 🔥 Guardar usuario y token en Zustand
      set({
        user: userData,
        token: data.token,
        loading: false,
      });

      // 🔥 Guardar en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      // 🔥 Guardar permisos y módulos en su store
      const permisosStore = usePermisosStore.getState();
      permisosStore.setModulos(data.modulos);
      permisosStore.setAcciones(data.permisos);

      // 🔥 Navegar sin recargar la app
      onSuccess && onSuccess();

    } catch (err) {
      console.error("Error login:", err);
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
