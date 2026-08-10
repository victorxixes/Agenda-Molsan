import { logsAPI } from "../api/logs";
import { useAuthStore } from "../store/authStore";

export async function crearLog(modulo, accion, descripcion, datos = {}, nivel = "INFO") {
  const { user } = useAuthStore.getState();

  try {
    await logsAPI.crear({
      usuario_id: user?.id || null,
      modulo,
      accion,
      descripcion,
      datos,
      nivel
    });
  } catch (err) {
    console.error("Error creando log:", err);
  }
}
