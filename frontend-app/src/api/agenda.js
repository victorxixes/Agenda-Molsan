import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export const agendaAPI = {
  citasDia: (fecha) =>
    axios.get(`${API}/agenda/citas/dia/${fecha}`).then(r => r.data),

  citasSemana: (fecha) =>
    axios.get(`${API}/agenda/citas/semana/${fecha}`).then(r => r.data),

  citasMes: (year, month) =>
    axios.get(`${API}/agenda/citas/mes/${year}/${month}`).then(r => r.data),

  crear: (data) =>
    axios.post(`${API}/agenda`, data).then(r => r.data),

  editar: (id, data) =>
    axios.put(`${API}/agenda/${id}`, data).then(r => r.data),

  eliminar: (id) =>
    axios.delete(`${API}/agenda/${id}`).then(r => r.data),

  mover: (id, fecha, hi, hf) =>
    axios.put(`${API}/agenda/citas/mover/${id}`, null, {
      params: {
        nueva_fecha: fecha,
        nueva_hora_inicio: hi,
        nueva_hora_fin: hf,
      },
    }).then(r => r.data),

  cambiarEstado: (id, estado) =>
    axios.put(`${API}/agenda/citas/estado/${id}`, null, {
      params: { nuevo_estado: estado },
    }).then(r => r.data),
};
