export function connectWS(url, onMessage, initialMessageFn = null) {
  let socket = null;
  let reconnectTimer = null;
  let isClosing = false;

  function start() {
    try {
      socket = new WebSocket(url);
      isClosing = false;

      socket.onopen = () => {
        console.log("WS conectado:", url);

        if (reconnectTimer) clearTimeout(reconnectTimer);

        // Enviar mensaje inicial si existe
        if (initialMessageFn) {
          try {
            const msg = initialMessageFn();
            socket.send(JSON.stringify(msg));
          } catch {}
        }
      };

      socket.onmessage = (event) => {
        try {
          if (!event?.data) return;
          const parsed = JSON.parse(event.data);
          onMessage(parsed);
        } catch {
          console.warn("WS mensaje inválido:", event?.data);
        }
      };

      socket.onerror = (err) => {
        console.warn("WS error:", err);
      };

      socket.onclose = () => {
        if (isClosing) return;

        console.log("WS cerrado, reconectando en 3s:", url);

        reconnectTimer = setTimeout(() => {
          start();
        }, 3000);
      };

      return socket;

    } catch (err) {
      console.error("WS fallo al conectar:", err);
      return null;
    }
  }

  const ws = start();

  return {
    socket: ws,
    close: () => {
      try {
        isClosing = true;
        if (reconnectTimer) clearTimeout(reconnectTimer);
        if (ws && ws.readyState !== WebSocket.CLOSED) {
          ws.close();
        }
      } catch {
        console.warn("WS ya estaba cerrado");
      }
    }
  };
}
