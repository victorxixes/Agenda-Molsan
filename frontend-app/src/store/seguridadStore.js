import { create } from "zustand";
import { seguridadAPI } from "../api/seguridad";

export const useSeguridadStore = create((set, get) => ({
  roles: [],
  rolActual: null,
  eventos: [],
  auditoria: [],
  loading: false,
  error: null,

  // -----------------------------
  // ROLES
  // -----------------------------
  cargarRoles: async () => {
    try {
      set({ loading: true });
      const data = await seguridadAPI.listarRoles();
      set({ roles: data, loading: false });
    } catch (err) {
      set({ loading: false, error: "Error cargando roles" });
    }
  },

  cargarRol: async (id) => {
    try {
      set({ loading: true });
      const data = await seguridadAPI.obtenerRol(id);
      set({ rolActual: data, loading: false });
    } catch (err) {
      set({ loading: false, error: "Error cargando rol" });
    }
  },

  crearRol: async (data) => {
    try {
      await seguridadAPI.crearRol(data);
      await get().cargarRoles();
    } catch (err) {
      set({ error: "Error creando rol" });
    }
  },

  actualizarRol: async (id, data) => {
    try {
      await seguridadAPI.actualizarRol(id, data);
      await get().cargarRol(id);
      await get().cargarRoles();
    } catch (err) {
      set({ error: "Error actualizando rol" });
    }
  },

  eliminarRol: async (id) => {
    try {
      await seguridadAPI.eliminarRol(id);
      await get().cargarRoles();
    } catch (err) {
      set({ error: "Error eliminando rol" });
    }
  },

  actualizarPermisosRol: async (id, permisos) => {
    try {
      await seguridadAPI.actualizarPermisosRol(id, permisos);
      await get().cargarRol(id);
    } catch (err) {
      set({ error: "Error actualizando permisos del rol" });
    }
  },

  actualizarModulosRol: async (id, modulos) => {
    try {
      await seguridadAPI.actualizarModulosRol(id, modulos);
      await get().cargarRol(id);
    } catch (err) {
      set({ error: "Error actualizando módulos del rol" });
    }
  },

  // -----------------------------
  // EVENTOS
  // -----------------------------
  cargarEventos: async () => {
    try {
      const data = await seguridadAPI.listarEventos();
      set({ eventos: data });
    } catch (err) {
      set({ error: "Error cargando eventos de seguridad" });
    }
  },

  // -----------------------------
  // AUDITORÍA
  // -----------------------------
  cargarAuditoria: async () => {
    try {
      const data = await seguridadAPI.listarAuditoria();
      set({ auditoria: data });
    } catch (err) {
      set({ error: "Error cargando auditoría" });
    }
  },
}));
