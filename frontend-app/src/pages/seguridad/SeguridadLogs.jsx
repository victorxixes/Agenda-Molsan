import { useEffect } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";
import TablaLogs from "../../components/logs/TablaLogs";

export default function SeguridadLogs() {
  const { logs = [], cargarTodo } = useSeguridad();

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  const columnas = [
    { campo: "fecha", titulo: "Fecha", esFecha: true },
    { campo: "evento", titulo: "Evento", esEvento: true },
    { campo: "detalle", titulo: "Detalle" },
    { campo: "ip", titulo: "IP" },
  ];

  const iconosEvento = {
    login: "🔐",
    login_error: "⚠️",
    acceso: "📥",
    update: "✏️",
    delete: "🗑️",
    default: "📄",
  };

  return (
    <div className="p-6 space-y-6 text-white animate-fade-in">
      <h1 className="text-3xl font-bold drop-shadow mb-4">
        Logs de seguridad — SJ‑2026
      </h1>

      <TablaLogs
        datos={logs || []}
        columnas={columnas}
        pageSize={20}
        titulo="Auditoría de seguridad"
        descripcion="Intentos de login, errores de autenticación y actividad sensible del sistema."
        enableSearch={true}
        enableDateFilter={true}
        enableExport={true}
        exportFilename="logs_seguridad"
        iconosEvento={iconosEvento}
      />
    </div>
  );
}
