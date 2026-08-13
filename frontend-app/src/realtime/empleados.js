import { connectWS } from "./ws";

export function connectEmpleados(onMessage) {
  return connectWS(
    `${import.meta.env.VITE_API_URL_WS}/ws/empleados`,
    onMessage
  );
}
