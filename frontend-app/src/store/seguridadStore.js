import { create } from "zustand";
import * as api from "../api/seguridad";

export const useSeguridadStore = create((set) => ({
  roles: [],
  permisos: {},
  modulos: [],
  permisosModulo: {},
  loading: false,

  cargarTodo: async () => {
    set({ loading: true });

    const [roles, permisos, modulos, permisosModulo] = await Promise.all([
      api.listarRoles(),
      api.listarPermisos(),
      api.listarModulos(),
      api.listarPermisosModulo(),
    ]);

    set({
      roles: roles.data,
      permisos: permisos.data,
      modulos: modulos.data,
      permisosModulo: permisosModulo.data,
      loading: false,
    });
  },

  guardarPermisos: async (data) => {
    await api.actualizarPermisos(data);
  },

  guardarModulos: async (data) => {
    await api.actualizarModulos(data);
  },

  guardarPermisosModulo: async (data) => {
    await api.actualizarPermisosModulo(data);
  },
}));
