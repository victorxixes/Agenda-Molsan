import { create } from "zustand";
import * as api from "../api/empleados";

export const useEmpleadosStore = create((set, get) => ({
  empleados: [],
  empleadoActual: null,
  modulosVisibles: [],
  permisosModulo: {},

  cargarEmpleados: async () => {
    const res = await api.listarEmpleados();
    set({ empleados: res.data });
  },

  buscar: async (q, activo) => {
    const res = await api.buscarEmpleados(q, activo);
    set({ empleados: res.data });
  },

  obtener: async (id) => {
    const res = await api.obtenerEmpleado(id);
    set({ empleadoActual: res.data });
  },

  crear: async (data) => {
    const res = await api.crearEmpleado(data);
    await get().cargarEmpleados();
    return res.data;
  },

  editar: async (id, data) => {
    const res = await api.editarEmpleado(id, data);
    await get().cargarEmpleados();
    return res.data;
  },

  eliminar: async (id) => {
    await api.eliminarEmpleado(id);
    await get().cargarEmpleados();
  },

  actualizarModulos: async (id, modulos) => {
    const res = await api.actualizarModulosVisibles(id, modulos);
    set({ modulosVisibles: res.data.modulos_visibles_list });
    return res.data;
  },

  actualizarPermisos: async (id, permisos) => {
    const res = await api.actualizarPermisosModulo(id, permisos);
    set({ permisosModulo: res.data.permisos_modulo_dict });
    return res.data;
  },
}));
