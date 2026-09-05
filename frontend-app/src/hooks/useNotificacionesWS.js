// useNotificacionesWS.js
// Módulo desactivado: Intranet NO usa WebSocket en esta versión del ERP.

export const useNotificacionesWS = () => {
  // Este hook queda desactivado porque el backend no expone /ws/intranet.
  // La intranet funciona mediante REST (documentos, noticias, dashboard).
  // Si en el futuro se activa el WebSocket, aquí se restaurará la lógica.
};
