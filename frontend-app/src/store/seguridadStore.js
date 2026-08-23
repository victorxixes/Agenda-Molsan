
import { create } from "zustand";
import { seguridadAPI } from "../api/seguridad";
import { crearLog } from "../lib/log";

export const useSeguridadStore = create((set, get) => ({
  roles: [],
  rol: null,
  eventos: [],
  loading: false,

  cargarRoles: async () => {
    set({ loading: true });
    const data = await seguridadAPI.listarRoles();
    const safe = Array.isArray(data) ? data : [];
    set({ roles: safe, loading: false });
  },

  cargarRol: async (id) => {
    set({ loading: true });
    const data = await seguridadAPI.obtenerRol(id);
    set({ rol: data, loading: false });
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

  actualizarRol: async (id, data) => {
    const res = await seguridadAPI.actualizarRol(id, data);

    await crearLog(
      "seguridad",
      "rol_editado",
      `Rol editado: ${res.nombre}`,
      res
    );

    await get().cargarRoles();
  },

  asignarPermiso: async (usuarioId, modulo, permiso) => {
    const res = await seguridadAPI.asignarPermiso(usuarioId, modulo, permiso);

    await crearLog(
      "seguridad",
      "permiso_asignado",
      `Permiso asignado: usuario ${usuarioId}, módulo ${modulo}, permiso ${permiso}`,
      res
    );
  },

  cargarEventos: async () => {
    set({ loading: true });
    const data = await seguridadAPI.listarEventos();
    const safe = Array.isArray(data) ? data : [];
    set({ eventos: safe, loading: false });
  },
}));
