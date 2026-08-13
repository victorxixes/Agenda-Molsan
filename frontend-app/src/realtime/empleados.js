import { connectWS } from "./ws";

export function connectEmpleados(empleadoId, onMessage) {
  return connectWS(
    `${import.meta.env.VITE_API_URL_WS}/ws/empleados`,
    onMessage,
    // Primer mensaje que enviamos al WS
    () => ({ empleado_id: empleadoId })
  );
}
