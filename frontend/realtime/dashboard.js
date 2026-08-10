import { connectWS } from "./ws";

export function connectDashboard(onMessage) {
  try {
    return connectWS(
      `${import.meta.env.VITE_API_URL_WS}/ws/dashboard`,
      (msg) => {
        if (!msg) return;
        onMessage(msg);
      }
    );
  } catch (e) {
    console.error("Error conectando WS Dashboard:", e);
    return { close: () => {} };
  }
}
