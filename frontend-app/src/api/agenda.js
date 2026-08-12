import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export const agendaAPI = {

  // CITAS DEL DÍA
  citasDia: (fecha) =>
    axios.get(`${API}/agenda/dia/${fecha}`).then(r => r.data),

  // CITAS DE LA SEMANA
  citasSemana: (fecha) =>
    axios.get(`${API}/agenda/semana/${fecha}`).then(r => r.data),

  // CITAS DEL MES
  citasMes: (year, month) =>
    axios.get(`${API}/agenda/mes/${year}/${month}`).then(r => r.data),

  // OBTENER UNA CITA
  obtener: (id) =>
    axios.get(`${API}/agenda/${id}`).then(r => r.data),

  // CREAR CITA
  crear: (data) =>
    axios.post(`${API}/agenda`, data).then(r => r.data),

  // EDITAR CITA
  editar: (id, data) =>
    axios.put(`${API}/agenda/${id}`, data).then(r => r.data),

  // ELIMINAR CITA
  eliminar: (id) =>
    axios.delete(`${API}/agenda/${id}`).then(r => r.data),

  // MOVER CITA (drag & drop)
  mover: (id, fecha, hi, hf) =>
    axios.put(`${API}/agenda/mover/${id}`, null, {
      params: {
        nueva_fecha: fecha,
        nueva_hora_inicio: hi,
        nueva_hora_fin: hf,
      },
    }).then(r => r.data),

  // CAMBIAR ESTADO
  cambiarEstado: (id, estado) =>
    axios.put(`${API}/agenda/estado/${id}`, null, {
      params: { nuevo_estado: estado },
    }).then(r => r.data),
};
