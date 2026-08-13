import axios from "../api/axios";
const API = import.meta.env.VITE_API_URL;

export const logsAPI = {
  listar: () =>
    axios.get(`${API}/logs`).then(r => r.data),

  crear: (data) =>
    axios.post(`${API}/logs`, data).then(r => r.data),

  porUsuario: (id) =>
    axios.get(`${API}/logs/usuario/${id}`).then(r => r.data),

  porModulo: (modulo) =>
    axios.get(`${API}/logs/modulo/${modulo}`).then(r => r.data),

  porNivel: (nivel) =>
    axios.get(`${API}/logs/nivel/${nivel}`).then(r => r.data),

  porFecha: (fechaISO) =>
    axios.get(`${API}/logs/fecha/${fechaISO}`).then(r => r.data),
};
