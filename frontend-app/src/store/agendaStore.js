import { create } from "zustand";
import { agendaAPI } from "../api/agenda";
import { crearLog } from "../lib/log";

export const useAgendaStore = create((set, get) => ({
  citasDia: [],
  citasMes: {},
  citas: [],
  citaActual: null,
  loading: false,

  // ---------------------------------------------------------
  // CARGAR CITAS DEL DÍA
  // ---------------------------------------------------------
  cargarDia: async (fecha) => {
    set({ loading: true });

    const data = await agendaAPI.citasDia(fecha);   // ✔ ruta nueva: /agenda/dia/{fecha}
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
    const data = await agendaAPI.citasMes(year, month);  // ✔ ruta nueva: /agenda/mes/{year}/{month}

    const mapa = {};

    data.forEach(cita => {
      const fecha = cita.fecha;
      if (!mapa[fecha]) mapa[fecha] = [];
      mapa[fecha].push(cita);
    });

    set({ citasMes: mapa });
  },

  // ---------------------------------------------------------
  // CARGAR UNA CITA COMPLETA
  // ---------------------------------------------------------
  cargarCita: async (id) => {
    const data = await agendaAPI.obtener(id);   // ✔ ruta nueva: /agenda/{id}
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

    const res = await agendaAPI.crear(payload);   // ✔ ruta nueva: POST /agenda

    await crearLog("agenda", "crear", `Cita creada para el día ${res.fecha}`, res);

    await get().cargarDia(res.fecha);
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

    const res = await agendaAPI.editar(id, payload);   // ✔ ruta nueva: PUT /agenda/{id}

    await crearLog("agenda", "editar", `Cita ${id} editada`, res);

    await get().cargarDia(payload.fecha);
  },

  // ---------------------------------------------------------
  // CAMBIAR ESTADO
  // ---------------------------------------------------------
  cambiarEstado: async (id, nuevoEstado) => {
    const res = await agendaAPI.cambiarEstado(id, nuevoEstado);   // ✔ ruta nueva: PUT /agenda/estado/{id}

    await crearLog("agenda", "estado", `Estado de cita ${id} cambiado a ${nuevoEstado}`, res);

    await get().cargarCita(id);
  },
}));
