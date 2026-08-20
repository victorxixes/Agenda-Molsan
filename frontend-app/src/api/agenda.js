import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export const agendaAPI = {

  // CITAS DEL DÍA
  citasDia: (fecha) =>
    axios.get(`${API}/api/agenda/dia/${fecha}`).then(r => r.data),

  // CITAS DE LA SEMANA
  citasSemana: (fecha) =>
    axios.get(`${API}/api/agenda/semana/${fecha}`).then(r => r.data),

  // CITAS DEL MES
  citasMes: (year, month) =>
    axios.get(`${API}/api/agenda/mes/${year}/${month}`).then(r => r.data),

  // OBTENER UNA CITA
  obtener: (id) =>
    axios.get(`${API}/api/agenda/${id}`).then(r => r.data),

  // CREAR CITA
  crear: (data) =>
    axios.post(`${API}/api/agenda`, data).then(r => r.data),

  // EDITAR CITA
  editar: (id, data) =>
    axios.put(`${API}/api/agenda/${id}`, data).then(r => r.data),

  // ELIMINAR CITA
  eliminar: (id) =>
    axios.delete(`${API}/api/agenda/${id}`).then(r => r.data),

  // MOVER CITA (drag & drop)
  mover: (id, fecha, hi, hf) =>
    axios.put(`${API}/api/agenda/mover/${id}`, null, {
      params: {
        nueva_fecha: fecha,
        nueva_hora_inicio: hi,
        nueva_hora_fin: hf,
      },
    }).then(r => r.data),

  // CAMBIAR ESTADO
  cambiarEstado: (id, estado) =>
    axios.put(`${API}/api/agenda/estado/${id}`, null, {
      params: { nuevo_estado: estado },
    }).then(r => r.data),
};
