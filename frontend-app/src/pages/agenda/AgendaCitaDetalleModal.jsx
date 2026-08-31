import { useEffect } from "react";
import { useAgendaStore } from "../../store/agendaStore";
import { useEmpleadosStore } from "../../store/empleadosStore";

const iconoTipoCita = (tipo) => {
  switch (tipo) {
    case "Firma notarial": return "🖋";
    case "Reunión": return "👥";
    case "Visita": return "👣";
    default: return "📄";
  }
};

const iconoTipoFirma = (vc) => {
  switch (vc) {
    case "SI": return "🎥 Videoconferencia";
    case "NO": return "📍 Presencial";
    default: return "—";
  }
};

export default function AgendaCitaDetalleModal({ onEditarCita }) {
  const citaActual = useAgendaStore((s) => s.citaActual);
  const setCitaActual = useAgendaStore((s) => s.setCitaActual);
  const eliminar = useAgendaStore((s) => s.eliminar);

  const empleados = useEmpleadosStore((s) => s.empleados);
  const cargarEmpleados = useEmpleadosStore((s) => s.cargarEmpleados);

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  if (!citaActual) return null;

  // 1️⃣ Apoderado del CTN
  const apoderadoCTN = citaActual.apoderado_s;

  // 2️⃣ Apoderado relación ORM
  const apoderadoRel =
    citaActual.apoderado
      ? `${citaActual.apoderado.nombre} ${citaActual.apoderado.apellidos}`
      : null;

  // 3️⃣ Apoderado desde empleadosStore
  const apoderadoObj = empleados.find(e => e.id === citaActual.apoderado_id);
  const apoderadoEmpleado = apoderadoObj
    ? `${apoderadoObj.nombre} ${apoderadoObj.apellidos}`
    : null;

  // 4️⃣ Prioridad final
  const apoderadoLabel =
    apoderadoCTN ||
    apoderadoRel ||
    apoderadoEmpleado ||
    citaActual.apoderado_id ||
    "—";

  const observacionLabel = citaActual.observacion || "—";

  const notarioLabel = citaActual.notario
    ? `${citaActual.notario.nombre} ${citaActual.notario.apellidos}`
    : citaActual.notario_id || "—";

  const eliminarCita = async () => {
    if (!confirm("¿Seguro que quieres eliminar esta cita?")) return;

    try {
      await eliminar(citaActual.id);
      alert("Cita eliminada correctamente");
      setCitaActual(null);
    } catch (err) {
      console.error(err);
      alert("Error eliminando la cita");
    }
  };

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
          <strong>Notario:</strong> {notarioLabel}
        </div>

        <div>
          <strong>Apoderado:</strong> {apoderadoLabel}
        </div>

        <div>
          <strong>Tipo firma:</strong> {iconoTipoFirma(citaActual.vc)}
        </div>

        <div>
          <strong>Observaciones:</strong> {observacionLabel}
        </div>

        <button
          className="btn-primary w-full"
          onClick={() => onEditarCita(citaActual.id)}
        >
          Editar cita
        </button>

        <button
          className="btn-danger w-full mt-2"
          onClick={eliminarCita}
        >
          Eliminar cita
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
