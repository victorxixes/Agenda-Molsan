import { create } from "zustand";
import { loginRequest } from "../api/auth";
import { usePermisosStore } from "./permisosStore";

// 🔥 Importar APIs y WebSockets del chat y empleados
import { mensajesAPI } from "../api/mensajes";
import { conectarChatWS, desconectarChatWS } from "../ws/chatWS";
import { conectarEmpleadosWS, desconectarEmpleadosWS } from "../ws/empleadosWS";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,

  // ---------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------
  login: async (usuario, password, onSuccess) => {
    set({ loading: true, error: null });

    try {
      const data = await loginRequest(usuario, password);

      // 🔥 Backend devuelve:
      // empleado_id, nombre, foto, modulos, permisos, token
      const userData = {
        id: data.empleado_id,
        nombre: data.nombre,
        rol: data.rol || "empleado",
        foto: data.foto || null,
        token: data.token,
      };

      set({
        user: userData,
        loading: false
      });

      // 🔥 Guardar permisos correctamente
      const permisosStore = usePermisosStore.getState();
      permisosStore.setModulos(data.modulos);
      permisosStore.setAcciones(data.permisos);

      // ---------------------------------------------------------
      // 🔥 REGISTRAR USUARIO COMO CONECTADO
      // ---------------------------------------------------------
      await mensajesAPI.conectar(userData.id);

      // ---------------------------------------------------------
      // 🔥 ACTIVAR WEBSOCKETS
      // ---------------------------------------------------------
      conectarChatWS(userData.id);
      conectarEmpleadosWS(userData.id);

      if (onSuccess) onSuccess();

    } catch (err) {
      console.error("ERROR LOGIN:", err);
      set({ error: "Credenciales incorrectas", loading: false });
      alert("Error al iniciar sesión");
    }
  },

  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------
  logout: async () => {
    const usuario = get().user;

    if (usuario) {
      // 🔥 Desconectar del backend
      await mensajesAPI.desconectar(usuario.id);

      // 🔥 Cerrar WebSockets
      desconectarChatWS();
      desconectarEmpleadosWS();
    }

    set({ user: null });
  },
}));
