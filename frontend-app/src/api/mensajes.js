import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export const mensajesAPI = {
  conectar: (usuarioId) =>
    axios.post(`${API}/mensajes/conectar/${usuarioId}`).then(r => r.data),

  desconectar: (usuarioId) =>
    axios.post(`${API}/mensajes/desconectar/${usuarioId}`).then(r => r.data),

  conectados: () =>
    axios.get(`${API}/mensajes/conectados`).then(r => r.data),

  conversacion: (u1, u2) =>
    axios.get(`${API}/mensajes/conversacion/${u1}/${u2}`).then(r => r.data),

  enviar: (data) =>
    axios.post(`${API}/mensajes`, data).then(r => r.data),

  marcarLeido: (remitente, destinatario) =>
    axios.put(`${API}/mensajes/leido/${remitente}/${destinatario}`).then(r => r.data),

  noLeidos: (usuarioId) =>
    axios.get(`${API}/mensajes/no-leidos/${usuarioId}`).then(r => r.data),
};
