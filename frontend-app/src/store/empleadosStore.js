import { create } from "zustand";
import {
  listarEmpleados,
  obtenerEmpleado,
  crearEmpleado,
  editarEmpleado,
  eliminarEmpleado,
  listarApoderados,
} from "../api/empleados";

/**
 * Store de Empleados — Versión SJ‑2026 Premium
 * Gestiona:
 * - Listado de empleados
 * - Listado de apoderados
 * - CRUD de empleados
 * - Estado de carga y error
 */

export const useEmpleadosStore = create((set, get) => ({
  empleados: [],
  apoderados: [],
  cargando: false,
  error: null,

  // ---------------------------------------------------------
  // CARGAR EMPLEADOS
  // ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // CARGAR APODERADOS
  // ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // OBTENER EMPLEADO
  // ---------------------------------------------------------
  obtener: async (id) => {
    try {
      const res = await obtenerEmpleado(id);
      return res.data || null;
    } catch {
      return null;
    }
  },

  // ---------------------------------------------------------
  // CREAR EMPLEADO
  // ---------------------------------------------------------
  crear: async (payload) => {
    const res = await crearEmpleado(payload);
    await get().cargarEmpleados();
    return res.data || null;
  },

  // ---------------------------------------------------------
  // EDITAR EMPLEADO
  // ---------------------------------------------------------
  editar: async (id, payload) => {
    const res = await editarEmpleado(id, payload);
    await get().cargarEmpleados();
    return res.data || null;
  },

  // ---------------------------------------------------------
  // ELIMINAR EMPLEADO
  // ---------------------------------------------------------
  eliminar: async (id) => {
    await eliminarEmpleado(id);
    await get().cargarEmpleados();
  },
}));
