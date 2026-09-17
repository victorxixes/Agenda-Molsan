import { create } from "zustand";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// Sanitizador universal SJ‑2026
const safe = (v) => {
  if (v === null || v === undefined) return "-";
  if (typeof v === "object") {
    if (Array.isArray(v)) return v.join(", ");
    try { return JSON.stringify(v); } catch { return "-" }
  }
  if (typeof v === "boolean") return v ? "Sí" : "No";
  return String(v);
};

// Sanitizar empleado
const safeEmpleado = (e) => ({
  id: Number(e.id),
  nombre: safe(e.nombre),
  apellidos: safe(e.apellidos),
  telefono: safe(e.telefono),
  email_empresa: safe(e.email_empresa),
  extension: safe(e.extension),
  activo: Boolean(e.activo),
  departamento_nombre: safe(e.departamento_nombre),
  seccion_nombre: safe(e.seccion_nombre),
  cargo_nombre: safe(e.cargo_nombre),
  foto: safe(e.foto),
  usuario: safe(e.usuario),
});

export const useSeguridadStore = create((set, get) => ({
  roles: [],
  permisos: [],
  empleados: [],
  ficha: null,
  auditoria: [],
  logs: [],
  loading: false,

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
        roles: Array.isArray(roles.data)
          ? roles.data.filter(r => r && typeof r.nombre === "string")
          : [],

        permisos: Array.isArray(permisos.data)
          ? permisos.data.filter(p => p && typeof p.modulo === "string")
          : [],

        empleados: Array.isArray(empleados.data)
          ? empleados.data.map(safeEmpleado)
          : Array.isArray(empleados.data?.empleados)
          ? empleados.data.empleados.map(safeEmpleado)
          : [],

        auditoria: Array.isArray(auditoria.data)
          ? auditoria.data.filter(a =>
              a &&
              typeof a.fecha === "string" &&
              typeof a.accion === "string"
            )
          : [],

        logs: Array.isArray(logs.data)
          ? logs.data.filter(l =>
              l &&
              typeof l.fecha === "string" &&
              typeof l.evento === "string"
            )
          : [],

        loading: false
      });
    } catch {
      set({ loading: false });
    }
  },

  cargarFicha: async (id) => {
    try {
      const res = await axios.get(`${API}/seguridad/empleado/${id}/ficha-completa`);

      const f = res.data || {};

      const empleado = f.empleado ? safeEmpleado(f.empleado) : null;

      const permisos_modulo_dict =
        typeof f.permisos_modulo_dict === "object"
          ? Object.fromEntries(
              Object.entries(f.permisos_modulo_dict).map(([mod, lista]) => [
                mod,
                Array.isArray(lista)
                  ? lista.filter(p => typeof p === "string")
                  : []
              ])
            )
          : {};

      set({
        ficha: {
          ...f,
          empleado,
          permisos_modulo_dict
        }
      });
    } catch {
      set({ ficha: {} });
    }
  },

  asignarRol: async (empleadoId, rolId) => {
    await axios.post(`${API}/seguridad/permisos/asignar-rol`, {
      empleado_id: empleadoId,
      rol_id: rolId
    });
    await get().cargarFicha(empleadoId);
  },

  asignarPermisos: async (empleadoId, permisos) => {
    await axios.post(
      `${API}/seguridad/asignar/empleado/${empleadoId}/permisos`,
      permisos
    );
    await get().cargarFicha(empleadoId);
  },

  asignarModulos: async (empleadoId, modulos) => {
    await axios.post(
      `${API}/seguridad/asignar/empleado/${empleadoId}/modulos`,
      modulos
    );
    await get().cargarFicha(empleadoId);
  },

  resetPassword: async (empleadoId, nuevaPassword) => {
    await axios.post(`${API}/seguridad/asignar/empleado/${empleadoId}/password`, {
      nueva_password: nuevaPassword
    });
  },

  bloquear: async (empleadoId) => {
    await axios.post(`${API}/seguridad/asignar/empleado/${empleadoId}/bloquear`);
    await get().cargarTodo();
  },

  desbloquear: async (empleadoId) => {
    await axios.post(`${API}/seguridad/asignar/empleado/${empleadoId}/desbloquear`);
    await get().cargarTodo();
  }
}));
