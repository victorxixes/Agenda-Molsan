import { create } from "zustand";
import { loginRequest } from "../api/auth_login.js";
import { usePermisosStore } from "./permisosStore";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,

  login: async (usuario, password, onSuccess) => {
    set({ loading: true, error: null });

    try {
      const data = await loginRequest(usuario, password);

      // 🔥 Validar que empleado_id existe y es número
      const empleadoId = Number(data.empleado_id);
      if (!empleadoId || isNaN(empleadoId)) {
        throw new Error("ID de empleado inválido en respuesta del backend");
      }

      const userData = {
        id: empleadoId,
        nombre: data.nombre,
        rol: data.rol || "empleado",
        foto: data.foto || null,
        token: data.token,
      };

      set({ user: userData, loading: false });

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

  logout: async () => {
    set({ user: null });
  },

}));

// ❌ NO activar WS durante login
// conectarChatWS(userData.id);
// conectarEmpleadosWS(userData.id);
