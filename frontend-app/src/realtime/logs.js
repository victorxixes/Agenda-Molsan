import { connectWS } from "./ws";

export function connectLogs(onMessage) {
  const WS = import.meta.env.VITE_WS_URL;
  return connectWS(`${WS}/ws/logs`, onMessage);
}
