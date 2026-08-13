import { create } from "zustand";
import { agendaAPI } from "../api/agenda";
import { crearLog } from "../lib/log";

export const useAgendaStore = create((set, get) => ({
  citasDia: [],
  citasMes: {},
  citas: [],
  citaActual: null,
  loading: false,
  mesActual: null,   // 🔥 Necesario para recargar el calendario

  // ---------------------------------------------------------
  // SET CITA ACTUAL (para abrir el modal)
  // ---------------------------------------------------------
  setCitaActual: (cita) => set({ citaActual: cita }),

  // ---------------------------------------------------------
  // CARGAR CITAS DEL DÍA
  // ---------------------------------------------------------
  cargarDia: async (fecha) => {
    set({ loading: true });

    const data = await agendaAPI.citasDia(fecha);
    const safe = Array.isArray(data) ? data : [];

    set({
      citasDia: safe,
      citas: safe,
      loading: false
    });
  },

  // ---------------------------------------------------------
  // CARGAR CITAS DEL MES (para CalendarGrid)
  // ---------------------------------------------------------
  cargarMes: async (year, month) => {
    const data = await agendaAPI.citasMes(year, month);

    const mapa = {};

    data.forEach(cita => {
      const fecha = cita.fecha;
      if (!mapa[fecha]) mapa[fecha] = [];
      mapa[fecha].push(cita);
    });

    set({ citasMes: mapa, mesActual: { year, month } });
  },

  // ---------------------------------------------------------
  // CARGAR UNA CITA COMPLETA
  // ---------------------------------------------------------
  cargarCita: async (id) => {
    const data = await agendaAPI.obtener(id);
    set({ citaActual: data });
  },

  // ---------------------------------------------------------
  // CREAR CITA
  // ---------------------------------------------------------
  crear: async (data) => {
    const payload = {
      fecha: data.fecha,
      hora_inicio: data.hora_inicio,
      hora_fin: data.hora_fin,
      tipo_cita: data.tipo_cita,
      notario_id: Number(data.notario_id),
      tipo_firma: data.tipo_firma || "",
      apoderado: data.apoderado || "",
      estado: data.estado,
      observaciones: data.observaciones || "",
    };

    const res = await agendaAPI.crear(payload);

    await crearLog("agenda", "crear", `Cita creada para el día ${res.fecha}`, res);

    // 🔥 Recargar el día
    await get().cargarDia(res.fecha);

    // 🔥 Recargar el mes actual (para que aparezca en el calendario)
    const { mesActual } = get();
    if (mesActual) {
      await get().cargarMes(mesActual.year, mesActual.month);
    }
  },

  // ---------------------------------------------------------
  // EDITAR CITA
  // ---------------------------------------------------------
  editar: async (id, data) => {
    const payload = {
      fecha: data.fecha,
      hora_inicio: data.hora_inicio,
      hora_fin: data.hora_fin,
      tipo_cita: data.tipo_cita,
      notario_id: Number(data.notario_id),
      tipo_firma: data.tipo_firma || "",
      apoderado: data.apoderado || "",
      estado: data.estado,
      observaciones: data.observaciones || "",
    };

    const res = await agendaAPI.editar(id, payload);

    await crearLog("agenda", "editar", `Cita ${id} editada`, res);

    await get().cargarDia(payload.fecha);

    const { mesActual } = get();
    if (mesActual) {
      await get().cargarMes(mesActual.year, mesActual.month);
    }
  },

  // ---------------------------------------------------------
  // CAMBIAR ESTADO
  // ---------------------------------------------------------
  cambiarEstado: async (id, nuevoEstado) => {
    const res = await agendaAPI.cambiarEstado(id, nuevoEstado);

    await crearLog("agenda", "estado", `Estado de cita ${id} cambiado a ${nuevoEstado}`, res);

    await get().cargarCita(id);

    const { mesActual } = get();
    if (mesActual) {
      await get().cargarMes(mesActual.year, mesActual.month);
    }
  },
}));
