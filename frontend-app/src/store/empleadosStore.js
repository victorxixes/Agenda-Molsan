import { create } from "zustand";
import {
  listarEmpleados,
  obtenerEmpleado,
  crearEmpleado,
  editarEmpleado,
  eliminarEmpleado,
  listarApoderados,
} from "../api/empleados";

export const useEmpleadosStore = create((set, get) => ({
  empleados: [],
  apoderados: [],
  cargando: false,
  error: null,

  cargarEmpleados: async () => {
    try {
      set({ cargando: true });

      const res = await listarEmpleados();
      const lista = Array.isArray(res.data) ? res.data : [];

      set({ empleados: lista, cargando: false });
    } catch (err) {
      console.error("Error cargando empleados:", err);
      set({ cargando: false, error: err.message });
    }
  },

  cargarApoderados: async () => {
    try {
      set({ cargando: true });

      const res = await listarApoderados();
      const lista = Array.isArray(res.data) ? res.data : [];

      set({ apoderados: lista, cargando: false });
    } catch (err) {
      console.error("Error cargando apoderados:", err);
      set({ cargando: false, error: err.message });
    }
  },

  obtener: async (id) => {
    const res = await obtenerEmpleado(id);
    return res.data || null;
  },

  crear: async (payload) => {
    const res = await crearEmpleado(payload);
    await get().cargarEmpleados();
    return res.data || null;
  },

  editar: async (id, payload) => {
    const res = await editarEmpleado(id, payload);
    await get().cargarEmpleados();
    return res.data || null;
  },

  eliminar: async (id) => {
    await eliminarEmpleado(id);
    await get().cargarEmpleados();
  },
}));
