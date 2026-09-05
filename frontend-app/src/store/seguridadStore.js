import { create } from "zustand";
import axios from "axios";

const API = "https://agenda-intranet-b.onrender.com/api";

export const useSeguridadStore = create((set, get) => ({
  roles: [],
  permisos: [],
  empleados: [],
  ficha: null,
  auditoria: [],
  logs: [],
  loading: false,

  // ---------------------------------------------------------
  // CARGA INICIAL
  // ---------------------------------------------------------
  cargarTodo: async () => {
    set({ loading: true });

    const [roles, empleados, auditoria, logs] = await Promise.all([
      axios.get(`${API}/seguridad/roles`),
      axios.get(`${API}/empleados`),
      axios.get(`${API}/seguridad/auditoria`),
      axios.get(`${API}/seguridad/logs`)
    ]);

    set({
      roles: roles.data,
      empleados: empleados.data,
      auditoria: auditoria.data,
      logs: logs.data,
      loading: false
    });
  },

  // ---------------------------------------------------------
  // FICHA EMPLEADO
  // ---------------------------------------------------------
  cargarFicha: async (id) => {
    const res = await axios.get(`${API}/seguridad/ficha/${id}`);
    set({ ficha: res.data });
  },

  // ---------------------------------------------------------
  // ASIGNAR ROL
  // ---------------------------------------------------------
  asignarRol: async (empleadoId, rolId) => {
    await axios.post(`${API}/seguridad/asignar/empleado/${empleadoId}/rol/${rolId}`);
    await get().cargarFicha(empleadoId);
  },

  // ---------------------------------------------------------
  // ASIGNAR PERMISOS
  // ---------------------------------------------------------
  asignarPermisos: async (empleadoId, permisos) => {
    await axios.post(`${API}/seguridad/asignar/empleado/${empleadoId}/permisos`, permisos);
    await get().cargarFicha(empleadoId);
  },

  // ---------------------------------------------------------
  // ASIGNAR MÓDULOS
  // ---------------------------------------------------------
  asignarModulos: async (empleadoId, modulos) => {
    await axios.post(`${API}/seguridad/asignar/empleado/${empleadoId}/modulos`, modulos);
    await get().cargarFicha(empleadoId);
  },

  // ---------------------------------------------------------
  // RESET PASSWORD
  // ---------------------------------------------------------
  resetPassword: async (empleadoId, nuevaPassword) => {
    await axios.post(`${API}/seguridad/asignar/empleado/${empleadoId}/password`, {
      nueva_password: nuevaPassword
    });
  },

  // ---------------------------------------------------------
  // BLOQUEAR / DESBLOQUEAR
  // ---------------------------------------------------------
  bloquear: async (empleadoId) => {
    await axios.post(`${API}/seguridad/asignar/empleado/${empleadoId}/bloquear`);
    await get().cargarTodo();
  },

  desbloquear: async (empleadoId) => {
    await axios.post(`${API}/seguridad/asignar/empleado/${empleadoId}/desbloquear`);
    await get().cargarTodo();
  }
}));
