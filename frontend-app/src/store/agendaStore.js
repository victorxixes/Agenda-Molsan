import { create } from "zustand";
import { agendaAPI } from "../api/agenda";
import { crearLog } from "../lib/log";

export const useAgendaStore = create((set, get) => ({
  citasDia: [],
  citasMes: {},
  citas: [],
  citaActual: null,
  loading: false,
  mesActual: null,

  setCitaActual: (cita) => set({ citaActual: cita }),

  cargarDia: async (fecha) => {
    set({ loading: true });
    const data = await agendaAPI.citasDia(fecha);
    const safe = Array.isArray(data) ? data : [];
    set({ citasDia: safe, citas: safe, loading: false });
  },

  cargarMes: async (mesString) => {
    set({ loading: true });

    const data = await agendaAPI.citasMes(mesString);
    const mapa = {};

    (data || []).forEach((cita) => {
      const fecha = cita.fecha;
      if (!mapa[fecha]) mapa[fecha] = [];
      mapa[fecha].push(cita);
    });

    set({ citasMes: mapa, mesActual: mesString, loading: false });
  },

  cargarCita: async (id) => {
    const data = await agendaAPI.obtener(id);
    set({ citaActual: data });
  },

  crear: async (data) => {
    const res = await agendaAPI.crear(data);

    await crearLog("agenda", "crear", `Cita creada para el día ${res.fecha}`, res);

    await get().cargarDia(res.fecha);

    const { mesActual } = get();
    if (mesActual) await get().cargarMes(mesActual);
  },

  editar: async (id, data) => {
    const res = await agendaAPI.editar(id, data);

    await crearLog("agenda", "editar", `Cita ${id} editada`, res);

    await get().cargarDia(data.fecha);

    const { mesActual } = get();
    if (mesActual) await get().cargarMes(mesActual);
  },

  cambiarEstado: async (id, nuevoEstado) => {
    const res = await agendaAPI.cambiarEstado(id, nuevoEstado);

    await crearLog("agenda", "estado", `Estado de cita ${id} cambiado a ${nuevoEstado}`, res);

    await get().cargarCita(id);

    const { mesActual } = get();
    if (mesActual) await get().cargarMes(mesActual);
  },
}));
