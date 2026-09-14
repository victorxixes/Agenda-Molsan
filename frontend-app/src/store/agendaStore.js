import { create } from "zustand";
import * as api from "../api/agenda";

export const useAgendaStore = create((set, get) => ({
  citas: [],
  cargando: false,
  vista: "mes",
  fechaActual: new Date().toISOString().slice(0, 10),

  // ============================
  // CARGA DE MES
  // ============================
  cargarMes: async (year, month) => {
    set({ cargando: true });

    const res = await api.getCitasMes(year, month);

    set({
      citas: Array.isArray(res.data) ? res.data : [],
      vista: "mes",
      fechaActual: `${year}-${String(month).padStart(2, "0")}-01`,
      cargando: false,
    });
  },

  // ============================
  // BÚSQUEDA
  // ============================
  buscar: async (params) => {
    set({ cargando: true });
    const res = await api.buscarCitas(params);
    set({ citas: Array.isArray(res.data) ? res.data : [], cargando: false });
  },

  // ============================
  // OBTENER CITA
  // ============================
  obtener: async (id) => {
    const res = await api.obtenerCita(id);
    return res.data;
  },

  // ============================
  // CREAR
  // ============================
  crear: async (data) => {
    const res = await api.crearCita(data);
    await get().refrescarVista();
    return res.data;
  },

  // ============================
  // EDITAR
  // ============================
  editar: async (id, data) => {
    const res = await api.editarCita(id, data);
    await get().refrescarVista();
    return res.data;
  },

  // ============================
  // ELIMINAR
  // ============================
  eliminar: async (id) => {
    await api.eliminarCita(id);
    await get().refrescarVista();
  },

  // ============================
  // MOVER
  // ============================
  mover: async (id, fecha, inicio, fin) => {
    const res = await api.moverCita(id, fecha, inicio, fin);
    await get().refrescarVista();
    return res.data;
  },

  // ============================
  // REFRESCAR VISTA ACTUAL
  // ============================
  refrescarVista: async () => {
    const fecha = get().fechaActual;
    const d = new Date(fecha);
    return get().cargarMes(d.getFullYear(), d.getMonth() + 1);
  },

  // ============================
  // WS: AÑADIR / EDITAR / ELIMINAR
  // ============================
  addCita: (cita) =>
    set((state) => ({
      citas: [...state.citas, cita],
    })),

  updateCita: (cita) =>
    set((state) => ({
      citas: state.citas.map((c) => (c.id === cita.id ? cita : c)),
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
