import { connectWS } from "./ws";

export function connectEmpleados(empleadoId, onMessage) {
  const WS = import.meta.env.VITE_WS_URL;

  return connectWS(
    `${WS}/ws/empleados`,
    onMessage,
    () => ({ empleado_id: empleadoId })
  );
}
