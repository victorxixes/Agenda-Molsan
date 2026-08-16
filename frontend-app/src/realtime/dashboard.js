import { connectWS } from "./ws";

export function connectDashboard(onMessage) {
  const WS = import.meta.env.VITE_WS_URL;

  try {
    return connectWS(`${WS}/ws/dashboard`, (msg) => {
      if (!msg) return;
      onMessage(msg);
    });
  } catch (e) {
    console.error("Error conectando WS Dashboard:", e);
    return { close: () => {} };
  }
}

