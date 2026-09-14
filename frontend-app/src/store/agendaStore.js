import { create } from "zustand";
import * as api from "../api/agenda";

// ============================
// NORMALIZADOR DE CITAS
// ============================
function normalizarCita(c) {
  return {
    id: c.id,
    fecha: c.fecha,
    hora_inicio: c.hora_inicio,
    hora_fin: c.hora_fin,
    tipo_cita: c.tipo_cita,
    tipo_firma: c.tipo_firma,
    observaciones: c.observaciones ?? "",

    notario_id: c.notario_id,
    notario_nombre: c.notario_nombre ?? "",
    notario: c.notario ?? null,

    apoderado_id: c.apoderado_id,
    apoderado_nombre: c.apoderado_nombre ?? "",
    apoderado: c.apoderado ?? null,
  };
}

export const useAgendaStore = create((set, get) => ({
  citas: [],
  cargando: false,
  vista: "mes",
  fechaActual: new Date().toLocaleDateString("sv-SE"),

  // ============================
  // CARGA DE MES
  // ============================
  cargarMes: async (year, month) => {
    set({ cargando: true });

    const res = await api.getCitasMes(year, month);

    const lista = res?.data?.citas ?? res?.data ?? [];

    set({
      citas: Array.isArray(lista) ? lista.map(normalizarCita) : [],
      vista: "mes",
      fechaActual: `${year}-${String(month).padStart(2, "0")}-01`,
      cargando: false,
    });
  },

  // ============================
  // CREAR
  // ============================
  crear: async (data, year, month) => {
    const res = await api.crearCita(data);
    await get().refrescarVista(year, month);
    return normalizarCita(res.data);
  },

  // ============================
  // EDITAR
  // ============================
  editar: async (id, data, year, month) => {
    const res = await api.editarCita(id, data);
    await get().refrescarVista(year, month);
    return normalizarCita(res.data);
  },

  // ============================
  // ELIMINAR
  // ============================
  eliminar: async (id, year, month) => {
    await api.eliminarCita(id);
    await get().refrescarVista(year, month);
  },

  // ============================
  // REFRESCAR VISTA ACTUAL
  // ============================
  refrescarVista: async (year, month) => {
    return get().cargarMes(year, month);
  },

  // ============================
  // WS: AÑADIR / EDITAR / ELIMINAR
  // ============================
  addCita: (cita) =>
    set((state) => ({
      citas: [...state.citas, normalizarCita(cita)],
    })),

  updateCita: (cita) =>
    set((state) => ({
      citas: state.citas.map((c) =>
        c.id === cita.id ? normalizarCita(cita) : c
      ),
    })),

  removeCita: (id) =>
    set((state) => ({
      citas: state.citas.filter((c) => c.id !== id),
    })),

  // ============================
  // RESALTADO
  // ============================
  resaltadaId: null,
  marcarResaltada: (id) => set({ resaltadaId: id }),
  limpiarResaltada: () => set({ resaltadaId: null }),

  // ============================
  // NOTIFICACIONES
  // ============================
  notificaciones: [],
  notify: (msg) =>
    set((state) => ({
      notificaciones: [...state.notificaciones, { id: Date.now(), msg }],
    })),
}));
