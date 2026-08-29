import { useAgendaStore } from "../../store/agendaStore";

export default function AgendaCitaDetalleModal({ onEditarCita }) {
  const { citaActual, setCitaActual } = useAgendaStore();

  if (!citaActual) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-md space-y-4 relative">

        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={() => setCitaActual(null)}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold">Detalle de la cita</h2>

        <div><strong>Fecha:</strong> {citaActual.fecha}</div>
        <div><strong>Hora:</strong> {citaActual.hora_inicio} - {citaActual.hora_fin}</div>
        <div><strong>Tipo:</strong> {citaActual.tipo_cita}</div>
        <div><strong>Notario:</strong> {citaActual.notario?.nombre} {citaActual.notario?.apellidos}</div>
        <div><strong>Apoderado:</strong> {citaActual.apoderado || "—"}</div>
        <div><strong>Tipo firma:</strong> {citaActual.tipo_firma || "—"}</div>
        <div><strong>Estado:</strong> {citaActual.estado}</div>
        <div><strong>Observaciones:</strong> {citaActual.observaciones || "—"}</div>

        {/* 🔥 BOTÓN EDITAR */}
        <button
          className="btn-primary w-full"
          onClick={() => onEditarCita(citaActual.id)}
        >
          Editar cita
        </button>

        <button
          className="btn-secondary w-full mt-2"
          onClick={() => setCitaActual(null)}
        >
          Cerrar
        </button>

      </div>
    </div>
  );
}
