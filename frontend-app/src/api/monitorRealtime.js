// Aquí solo gestionamos la URL del WebSocket.
// El análisis de conexiones lo hacemos en el front.

export const buildRealtimeWsUrl = (baseUrl, params = {}) => {
  const url = new URL("/ws/realtime/", baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString().replace("http", "ws");
};
