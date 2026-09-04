import { useEffect } from "react";
import { useEmpleadosStore } from "../store/empleadosStore";

export const useEmpleadosWS = (usuarioId) => {
  const cargarEmpleados = useEmpleadosStore((s) => s.cargarEmpleados);

  useEffect(() => {
    const ws = new WebSocket(
      `${import.meta.env.VITE_WS}/ws/empleados`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.tipo === "ws_conectado") return;

      // Si llega un evento de empleados → refrescamos
      cargarEmpleados();
    };

    return () => ws.close();
  }, [usuarioId]);
};
