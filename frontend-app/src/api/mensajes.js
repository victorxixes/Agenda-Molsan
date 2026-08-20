import axios from "../api/axios";

export const mensajesAPI = {
  conectar: (usuarioId) =>
    axios.post(`/api/mensajes/conectar/${usuarioId}`).then(r => r.data),

  desconectar: (usuarioId) =>
    axios.post(`/api/mensajes/desconectar/${usuarioId}`).then(r => r.data),

  conectados: () =>
    axios.get(`/api/mensajes/conectados`).then(r => r.data),

  conversacion: (u1, u2) =>
    axios.get(`/api/mensajes/conversacion/${u1}/${u2}`).then(r => r.data),

  enviar: (data) =>
    axios.post(`/api/mensajes`, data).then(r => r.data),

  marcarLeido: (remitente, destinatario) =>
    axios.put(`/api/mensajes/leido/${remitente}/${destinatario}`).then(r => r.data),

  noLeidos: (usuarioId) =>
    axios.get(`/api/mensajes/no-leidos/${usuarioId}`).then(r => r.data),
};
