import { connectWS } from "./ws";

export function connectIntranet(onMessage) {
  return connectWS(
    `${import.meta.env.VITE_API_URL_WS}/ws/intranet`,
    onMessage
  );
}
