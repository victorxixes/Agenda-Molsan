import { create } from "zustand";
import {
  listarEmpleados,
  obtenerEmpleado,
  crearEmpleado,
  editarEmpleado,
  eliminarEmpleado,
  listarApoderados,
} from "../api/empleados";

const safe = (v) => {
  if (v === null || v === undefined) return "-";
  if (typeof v === "object") {
    try { return JSON.stringify(v); } catch { return "-" }
  }
  return String(v);
};

const safeEmpleado = (e) => ({
  id: Number(e.id),
  nombre: safe(e.nombre),
  apellidos: safe(e.apellidos),
  telefono: safe(e.telefono),
  email_empresa: safe(e.email_empresa),
  activo: Boolean(e.activo),
  departamento_nombre: safe(e.departamento_nombre),
  seccion_nombre: safe(e.seccion_nombre),
  cargo_nombre: safe(e.cargo_nombre),
  foto: safe(e.foto),
  usuario: safe(e.usuario),
});

export const useEmpleadosStore = create((set, get) => ({
  empleados: [],
  apoderados: [],
  cargando: false,
  error: null,

  cargarEmpleados: async () => {
    try {
      set({ cargando: true });

      const res = await listarEmpleados();
      const lista = Array.isArray(res.data)
        ? res.data.map(safeEmpleado)
        : [];

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
      const lista = Array.isArray(res.data)
        ? res.data.map(safeEmpleado)
        : [];

      set({ apoderados: lista, cargando: false });
    } catch (err) {
      console.error("Error cargando apoderados:", err);
      set({ cargando: false, error: err.message });
    }
  },

  obtener: async (id) => {
    try {
      const res = await obtenerEmpleado(id);
      return res.data ? safeEmpleado(res.data) : null;
    } catch {
      return null;
    }
  },

  crear: async (payload) => {
    const res = await crearEmpleado(payload);
    await get().cargarEmpleados();
    return res.data ? safeEmpleado(res.data) : null;
  },

  editar: async (id, payload) => {
    const res = await editarEmpleado(id, payload);
    await get().cargarEmpleados();
    return res.data ? safeEmpleado(res.data) : null;
  },

  eliminar: async (id) => {
    await eliminarEmpleado(id);
    await get().cargarEmpleados();
  },
}));
