import axios from "../api/axios";

export const logsAPI = {
  listar: () =>
    axios.get(`/logs`).then(r => r.data),

  crear: (data) =>
    axios.post(`/logs`, data).then(r => r.data),

  porUsuario: (id) =>
    axios.get(`/logs/usuario/${id}`).then(r => r.data),

  porModulo: (modulo) =>
    axios.get(`/logs/modulo/${modulo}`).then(r => r.data),

  porNivel: (nivel) =>
    axios.get(`/logs/nivel/${nivel}`).then(r => r.data),

  porFecha: (fechaISO) =>
    axios.get(`/logs/fecha/${fechaISO}`).then(r => r.data),
};
