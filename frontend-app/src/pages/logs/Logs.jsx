import { useEffect } from "react";
import { useLogs } from "../../hooks/useLogs";
import TablaLogs from "../../components/logs/TablaLogs";

export default function Logs() {
  const { logs, cargarLogs, loading } = useLogs();

  useEffect(() => {
    cargarLogs({});
  }, [cargarLogs]);

  const columnas = [
    { campo: "id", titulo: "ID" },
    { campo: "tipo", titulo: "Tipo" },
    { campo: "mensaje", titulo: "Mensaje" },
    { campo: "fecha", titulo: "Fecha", esFecha: true },
  ];

  const iconosTipo = {
    error: "⛔",
    security: "🔐",
    warning: "⚠️",
    info: "ℹ️",
    default: "•",
  };

  return (
    <div className="p-6 space-y-8 text-white animate-fade-in">
      <div className="
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
        p-6 shadow-xl
      ">
        <h1 className="text-3xl font-bold drop-shadow">Logs del sistema</h1>
        <p className="text-white/70 text-sm mt-1">
          Monitorización avanzada de eventos, seguridad y actividad del ERP.
        </p>
      </div>

      {loading ? (
        <p className="text-white/70 text-sm animate-pulse">Cargando logs…</p>
      ) : (
        <TablaLogs
          datos={logs || []}
          columnas={columnas}
          pageSize={50}
          titulo="Listado de logs"
          descripcion="Registros generales del sistema, ordenados por fecha y tipo."
          enableSearch={true}
          enableDateFilter={true}
          enableExport={true}
          exportFilename="logs_sistema"
          iconosEvento={iconosTipo}
        />
      )}
    </div>
  );
}
