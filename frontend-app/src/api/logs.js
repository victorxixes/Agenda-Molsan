import axios from "../api/axios";

export const logsAPI = {
  listar: () =>
    axios.get(`/api/logs`).then(r => r.data),

  crear: (data) =>
    axios.post(`/api/logs`, data).then(r => r.data),

  porUsuario: (id) =>
    axios.get(`/api/logs/usuario/${id}`).then(r => r.data),

  porModulo: (modulo) =>
    axios.get(`/api/logs/modulo/${modulo}`).then(r => r.data),

  porNivel: (nivel) =>
    axios.get(`/api/logs/nivel/${nivel}`).then(r => r.data),

  porFecha: (fechaISO) =>
    axios.get(`/api/logs/fecha/${fechaISO}`).then(r => r.data),
};
