import { create } from "zustand";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

/**
 * Store de Seguridad — Versión SJ‑2026 Premium
 * Gestiona:
 * - Roles
 * - Permisos
 * - Empleados
 * - Ficha completa
 * - Auditoría
 * - Logs
 * - Acciones de seguridad (roles, permisos, módulos, bloqueo)
 */

export const useSeguridadStore = create((set, get) => ({
  roles: [],
  permisos: [],
  empleados: [],
  ficha: null,
  auditoria: [],
  logs: [],
  loading: false,

  // ---------------------------------------------------------
  // CARGA INICIAL (roles, permisos, empleados, auditoría, logs)
  // ---------------------------------------------------------
  cargarTodo: async () => {
    set({ loading: true });

    try {
      const [roles, permisos, empleados, auditoria, logs] = await Promise.all([
        axios.get(`${API}/seguridad/roles`),
        axios.get(`${API}/seguridad/permisos`),
        axios.get(`${API}/empleados`),
        axios.get(`${API}/seguridad/auditoria`),
        axios.get(`${API}/seguridad/logs`)
      ]);

      set({
        roles: roles.data || [],
        permisos: permisos.data || [],
        empleados: empleados.data || [],
        auditoria: auditoria.data || [],
        logs: logs.data || [],
        loading: false
      });
    } catch {
      set({ loading: false });
    }
  },

  // ---------------------------------------------------------
  // FICHA COMPLETA DEL EMPLEADO
  // ---------------------------------------------------------
  cargarFicha: async (id) => {
    try {
      const res = await axios.get(`${API}/seguridad/empleado/${id}/ficha-completa`);
      set({ ficha: res.data || {} });
    } catch {
      set({ ficha: {} });
    }
  },

  // ---------------------------------------------------------
  // ASIGNAR ROL
  // ---------------------------------------------------------
  asignarRol: async (empleadoId, rolId) => {
    await axios.post(`${API}/seguridad/permisos/asignar-rol`, {
      empleado_id: empleadoId,
      rol_id: rolId
    });

    await get().cargarFicha(empleadoId);
  },

  // ---------------------------------------------------------
  // ASIGNAR PERMISOS
  // ---------------------------------------------------------
  asignarPermisos: async (empleadoId, permisos) => {
    await axios.post(
      `${API}/seguridad/asignar/empleado/${empleadoId}/permisos`,
      permisos
    );

    await get().cargarFicha(empleadoId);
  },

  // ---------------------------------------------------------
  // ASIGNAR MÓDULOS VISIBLES
  // ---------------------------------------------------------
  asignarModulos: async (empleadoId, modulos) => {
    await axios.post(
      `${API}/seguridad/asignar/empleado/${empleadoId}/modulos`,
      modulos
    );

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
  // BLOQUEAR / DESBLOQUEAR EMPLEADO
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
