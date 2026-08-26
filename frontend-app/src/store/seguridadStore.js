import { create } from "zustand";
import { seguridadAPI } from "../api/seguridad";
import { crearLog } from "../lib/log";

export const useSeguridadStore = create((set, get) => ({
  roles: [],
  permisosBase: [],
  permisosRol: {},
  eventos: [],
  loading: false,

  // ---------------------------------------------------------
  // REALTIME
  // ---------------------------------------------------------
  addRealtimeEvent: (ev) =>
    set((state) => ({
      eventos: [ev, ...state.eventos].slice(0, 200),
    })),

  // ---------------------------------------------------------
  // CARGAR ROLES
  // ---------------------------------------------------------
  cargarRoles: async () => {
    try {
      set({ loading: true });
      const data = await seguridadAPI.listarRoles();
      set({ roles: Array.isArray(data) ? data : [], loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  // ---------------------------------------------------------
  // CARGAR PERMISOS BASE
  // ---------------------------------------------------------
  cargarPermisosBase: async () => {
    try {
      const data = await seguridadAPI.listarPermisosBase();
      set({ permisosBase: data || [] });
    } catch (err) {
      // manejar error si quieres
    }
  },

  // ---------------------------------------------------------
  // CARGAR PERMISOS DE UN ROL
  // ---------------------------------------------------------
  cargarPermisosRol: async (rolId) => {
    try {
      const data = await seguridadAPI.obtenerPermisosRol(rolId);
      set((state) => ({
        permisosRol: {
          ...state.permisosRol,
          [rolId]: data || [],
        },
      }));
    } catch (err) {
      // manejar error si quieres
    }
  },

  // ---------------------------------------------------------
  // CREAR ROL
  // ---------------------------------------------------------
  crearRol: async (data) => {
    try {
      const res = await seguridadAPI.crearRol(data);

      await crearLog(
        "seguridad",
        "rol_creado",
        `Rol creado: ${res.nombre}`,
        res
      );

      await get().cargarRoles();
    } catch (err) {
      // manejar error
    }
  },

  // ---------------------------------------------------------
  // EDITAR ROL
  // ---------------------------------------------------------
  editarRol: async (id, data) => {
    try {
      const res = await seguridadAPI.actualizarRol(id, data);

      await crearLog(
        "seguridad",
        "rol_editado",
        `Rol editado: ${res.nombre}`,
        res
      );

      await get().cargarRoles();
    } catch (err) {
      // manejar error
    }
  },

  // ---------------------------------------------------------
  // CARGAR EVENTOS DE SEGURIDAD
  // ---------------------------------------------------------
  cargarEventos: async () => {
    try {
      const data = await seguridadAPI.listarEventos();
      set({ eventos: Array.isArray(data) ? data : [] });
    } catch (err) {
      // manejar error
    }
  },
}));
