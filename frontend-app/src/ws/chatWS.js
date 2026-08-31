import { useMensajesStore } from "../store/mensajesStore";

let wsChat = null;
let chatHeartbeat = null;

// ⭐ CONECTAR CHAT WS
export function conectarChatWS(usuarioId) {
  if (!usuarioId || isNaN(usuarioId)) return;

  // Registrar en la API REST (Swagger)
  fetch(`${import.meta.env.VITE_API_URL}/api/mensajes/conectar/${usuarioId}`, {
    method: "POST"
  });

  wsChat = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/chat/${usuarioId}`);

  wsChat.onopen = () => {
    // Heartbeat para mantener vivo el WS
    chatHeartbeat = setInterval(() => {
      if (wsChat.readyState === WebSocket.OPEN) {
        wsChat.send(JSON.stringify({ tipo: "ping" }));
      }
    }, 25000);
  };

  wsChat.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.tipo === "mensaje") {
      useMensajesStore.getState().agregarMensajeRealtime(data);
    }

    if (data.tipo === "typing") {
      useMensajesStore.getState().setTyping(true);
      setTimeout(() => useMensajesStore.getState().setTyping(false), 1500);
    }

    if (data.tipo === "typing_estado") {
      useMensajesStore.getState().setTypingEstado(data.usuario_id);
    }
  };
}

// ⭐ ENVIAR MENSAJE
export function enviarMensajeWS(msg) {
  wsChat?.send(JSON.stringify({
    tipo: "mensaje",
    remitente_id: msg.remitente_id,
    destinatario_id: msg.destinatario_id,
    mensaje: msg.mensaje
  }));
}

// ⭐ ENVIAR TYPING
export function enviarTypingWS(remitente_id, destinatario_id) {
  wsChat?.send(JSON.stringify({
    tipo: "typing",
    remitente_id,
    destinatario_id
  }));
}

// ⭐ DESCONECTAR CHAT WS
export function desconectarChatWS(usuarioId) {
  clearInterval(chatHeartbeat);

  // Registrar desconexión en la API REST
  fetch(`${import.meta.env.VITE_API_URL}/api/mensajes/desconectar/${usuarioId}`, {
    method: "POST"
  });

  wsChat?.close();
}
