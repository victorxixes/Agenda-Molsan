import { useMensajesStore } from "../store/mensajesStore";

let wsEmpleados = null;

export function conectarEmpleadosWS(usuarioId) {
  if (!usuarioId || isNaN(usuarioId)) return; // 🔥 evita URLs inválidas

  wsEmpleados = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/empleados`);

  wsEmpleados.onopen = () => {
    wsEmpleados.send(JSON.stringify({ empleado_id: usuarioId }));
  };

  wsEmpleados.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.tipo === "empleado_conectado" || data.tipo === "empleado_desconectado") {
      useMensajesStore.getState().cargarConectados();
    }
  };
}

export function desconectarEmpleadosWS() {
  wsEmpleados?.close();
}
