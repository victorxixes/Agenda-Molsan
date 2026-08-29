import { useAgendaStore } from "../../store/agendaStore";
import { useEmpleadosStore } from "../../store/empleadosStore";

// 🔥 Iconos para tipo de cita
const iconoTipoCita = (tipo) => {
  switch (tipo) {
    case "Firma notarial": return "🖋";
    case "Reunión": return "👥";
    case "Visita": return "👣";
    default: return "📄";
  }
};

// 🔥 Iconos para tipo de firma
const iconoTipoFirma = (tipo) => {
  switch (tipo) {
    case "Videoconferencia": return "🎥";
    case "Presencial": return "📍";
    default: return "—";
  }
};

export default function AgendaCitaDetalleModal({ onEditarCita }) {
  const { citaActual, setCitaActual } = useAgendaStore();
  const { empleados, cargarEmpleados } = useEmpleadosStore();

  if (!citaActual) return null;

  // 🔥 Cargar empleados si no están cargados
  if (empleados.length === 0) cargarEmpleados();

  // 🔥 Resolver nombre del apoderado
  const apoderadoObj = empleados.find(e => e.id === citaActual.apoderado_id);

  const apoderadoLabel = apoderadoObj
    ? `${apoderadoObj.nombre} ${apoderadoObj.apellidos}`
    : "—";

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

        <div>
          <strong>Hora:</strong> {citaActual.hora_inicio} - {citaActual.hora_fin}
        </div>

        <div>
          <strong>Tipo:</strong> {iconoTipoCita(citaActual.tipo_cita)} {citaActual.tipo_cita}
        </div>

        <div>
          <strong>Notario:</strong> {citaActual.notario?.nombre} {citaActual.notario?.apellidos}
        </div>

        <div>
          <strong>Apoderado:</strong> {apoderadoLabel}
        </div>

        <div>
          <strong>Tipo firma:</strong> {iconoTipoFirma(citaActual.tipo_firma)} {citaActual.tipo_firma || "—"}
        </div>

        <div>
          <strong>Observaciones:</strong> {citaActual.observaciones || "—"}
        </div>

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
