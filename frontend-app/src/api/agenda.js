import axios from "../api/axios";

export const agendaAPI = {

  // LISTAR POR DÍA
  citasDia: (fecha) =>
    axios.get(`/agenda/dia/${fecha}`).then(r => r.data),

  // LISTAR POR SEMANA
  citasSemana: (fecha) =>
    axios.get(`/agenda/semana/${fecha}`).then(r => r.data),

  // LISTAR POR MES (acepta "2026-08")
  citasMes: (mesString) => {
    const [year, month] = mesString.split("-");
    return axios.get(`/agenda/mes/${year}/${month}`).then(r => r.data);
  },

  // OBTENER UNA CITA
  obtener: (id) =>
    axios.get(`/agenda/${id}`).then(r => r.data),

  // CREAR CITA
  crear: (data) =>
    axios.post(`/agenda`, data).then(r => r.data),

  // EDITAR CITA
  editar: (id, data) =>
    axios.put(`/agenda/${id}`, data).then(r => r.data),

  // ELIMINAR CITA
  eliminar: (id) =>
    axios.delete(`/agenda/${id}`).then(r => r.data),

  // MOVER CITA (drag & drop)
  mover: (id, fecha, hi, hf) =>
    axios.put(`/agenda/mover/${id}`, null, {
      params: {
        nueva_fecha: fecha,
        nueva_hora_inicio: hi,
        nueva_hora_fin: hf,
      },
    }).then(r => r.data),

  // CAMBIAR ESTADO
  cambiarEstado: (id, estado) =>
    axios.put(`/agenda/estado/${id}`, null, {
      params: { nuevo_estado: estado },
    }).then(r => r.data),
};
