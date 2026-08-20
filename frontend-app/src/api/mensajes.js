import axios from "../api/axios";

export const mensajesAPI = {
  conectar: (usuarioId) =>
    axios.post(`/mensajes/conectar/${usuarioId}`).then(r => r.data),

  desconectar: (usuarioId) =>
    axios.post(`/mensajes/desconectar/${usuarioId}`).then(r => r.data),

  conectados: () =>
    axios.get(`/mensajes/conectados`).then(r => r.data),

  conversacion: (u1, u2) =>
    axios.get(`/mensajes/conversacion/${u1}/${u2}`).then(r => r.data),

  enviar: (data) =>
    axios.post(`/mensajes`, data).then(r => r.data),

  marcarLeido: (remitente, destinatario) =>
    axios.put(`/mensajes/leido/${remitente}/${destinatario}`).then(r => r.data),

  noLeidos: (usuarioId) =>
    axios.get(`/mensajes/no-leidos/${usuarioId}`).then(r => r.data),
};
