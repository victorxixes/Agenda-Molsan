import { create } from "zustand";
import { seguridadAPI } from "../api/seguridad";
import { crearLog } from "../lib/log";

export const useSeguridadStore = create((set, get) => ({
  roles: [],
  permisosBase: [],
  permisosRol: {},
  eventos: [],
  loading: false,

  cargarRoles: async () => {
    set({ loading: true });
    const data = await seguridadAPI.listarRoles();
    set({ roles: Array.isArray(data) ? data : [], loading: false });
  },

  crearRol: async (data) => {
    const res = await seguridadAPI.crearRol(data);

    await crearLog(
      "seguridad",
      "rol_creado",
      `Rol creado: ${res.nombre}`,
      res
    );

    await get().cargarRoles();
  },

  cargarPermisosBase: async () => {
    const data = await seguridadAPI.obtenerPermisosBase();
    set({ permisosBase: data });
  },

  cargarPermisosRol: async (rolId) => {
    const data = await seguridadAPI.obtenerPermisosRol(rolId);
    set({ permisosRol: data });
  },

  cargarEventos: async () => {
    set({ loading: true });
    const data = await seguridadAPI.listarEventos();
    set({ eventos: Array.isArray(data) ? data : [], loading: false });
  },
}));
