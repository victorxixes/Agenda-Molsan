import axios from "../api/axios";

export const agendaAPI = {

  citasDia: (fecha) =>
    axios.get(`/api/agenda/dia/${fecha}`).then(r => r.data),

  citasSemana: (fecha) =>
    axios.get(`/api/agenda/semana/${fecha}`).then(r => r.data),

  citasMes: (year, month) =>
    axios.get(`/api/agenda/mes/${year}/${month}`).then(r => r.data),

  obtener: (id) =>
    axios.get(`/api/agenda/${id}`).then(r => r.data),

  crear: (data) =>
    axios.post(`/api/agenda`, data).then(r => r.data),

  editar: (id, data) =>
    axios.put(`/api/agenda/${id}`, data).then(r => r.data),

  eliminar: (id) =>
    axios.delete(`/api/agenda/${id}`).then(r => r.data),

  mover: (id, fecha, hi, hf) =>
    axios.put(`/api/agenda/mover/${id}`, null, {
      params: {
        nueva_fecha: fecha,
        nueva_hora_inicio: hi,
        nueva_hora_fin: hf,
      },
    }).then(r => r.data),

  cambiarEstado: (id, estado) =>
    axios.put(`/api/agenda/estado/${id}`, null, {
      params: { nuevo_estado: estado },
    }).then(r => r.data),
};
