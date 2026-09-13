import { create } from "zustand";
import * as api from "../api/agenda";

export const useAgendaStore = create((set, get) => ({
  // -----------------------------
  // ESTADO PRINCIPAL
  // -----------------------------
  citas: [],
  cargando: false,
  vista: "mes",
  fechaActual: new Date().toISOString().slice(0, 10),

  // -----------------------------
  // CARGA DE DATOS
  // -----------------------------
  cargarMes: async (year, month) => {
    set({ cargando: true });

    const res = await api.getCitasMes(year, month);
    const citas = Array.isArray(res.data) ? res.data : [];

    set({
      citas,
      vista: "mes",
      fechaActual: `${year}-${String(month).padStart(2, "0")}-01`,
      cargando: false,
    });
  },

  buscar: async (params) => {
    set({ cargando: true });

    const res = await api.buscarCitas(params);
    const citas = Array.isArray(res.data) ? res.data : [];

    set({ citas, cargando: false });
  },

  obtener: async (id) => {
    const res = await api.obtenerCita(id);
    return res.data;
  },

  // -----------------------------
  // CRUD API (manual)
  // -----------------------------
  crear: async (data) => {
    const res = await api.crearCita(data);
    await get().refrescarVista();
    return res.data;
  },

  editar: async (id, data) => {
    const res = await api.editarCita(id, data);
    await get().refrescarVista();
    return res.data;
  },

  eliminar: async (id) => {
    await api.eliminarCita(id);
    await get().refrescarVista();
  },

  mover: async (id, fecha, inicio, fin) => {
    const res = await api.moverCita(id, fecha, inicio, fin);
    await get().refrescarVista();
    return res.data;
  },

  refrescarVista: async () => {
    const fecha = get().fechaActual;
    const d = new Date(fecha);
    return get().cargarMes(d.getFullYear(), d.getMonth() + 1);
  },

  // -----------------------------
  // WS: ACTUALIZACIÓN INSTANTÁNEA
  // -----------------------------
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

  // -----------------------------
  // RESALTADO DE CITA RECIÉN CREADA
  // -----------------------------
  resaltadaId: null,

  marcarResaltada: (id) =>
    set({
      resaltadaId: id,
    }),

  limpiarResaltada: () =>
    set({
      resaltadaId: null,
    }),

  // -----------------------------
  // NOTIFICACIONES EN TIEMPO REAL
  // -----------------------------
  notificaciones: [],

  notify: (msg) =>
    set((state) => ({
      notificaciones: [
        ...state.notificaciones,
        { id: Date.now(), msg },
      ],
    })),
}));
