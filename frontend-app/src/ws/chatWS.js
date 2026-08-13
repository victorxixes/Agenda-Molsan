import { useMensajesStore } from "../store/mensajesStore";

let wsChat = null;

export function conectarChatWS(usuarioId) {
  wsChat = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/chat/${usuarioId}`);

  wsChat.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.tipo === "mensaje") {
      useMensajesStore.getState().agregarMensajeRealtime(data);
    }

    if (data.tipo === "typing") {
      useMensajesStore.getState().setTyping(true);
      setTimeout(() => useMensajesStore.getState().setTyping(false), 1500);
    }
  };
}

export function enviarMensajeWS(msg) {
  wsChat.send(JSON.stringify({
    tipo: "mensaje",
    remitente_id: msg.remitente_id,
    destinatario_id: msg.destinatario_id,
    mensaje: msg.mensaje
  }));
}

export function enviarTypingWS(remitente_id, destinatario_id) {
  wsChat.send(JSON.stringify({
    tipo: "typing",
    remitente_id,
    destinatario_id
  }));
}

export function desconectarChatWS() {
  wsChat?.close();
}
