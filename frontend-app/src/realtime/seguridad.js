import { connectWS } from "./ws";

export function connectSeguridad(onMessage) {
  const WS = import.meta.env.VITE_WS_URL;   // ✔ variable correcta
  console.log("WS URL USADA:", WS);
  return connectWS(`${WS}/ws/seguridad`, onMessage);
}
