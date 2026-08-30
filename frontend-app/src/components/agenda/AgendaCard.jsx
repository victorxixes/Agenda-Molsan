import { useEffect } from "react";
import GlassCard from "../ui/GlassCard.jsx";
import IconAgenda from "../icons/IconAgenda.jsx";
import { useAgendaStore } from "../../store/agendaStore";
import { useEmpleadosStore } from "../../store/empleadosStore";

export default function AgendaCard({ cita, onEditarCita }) {
  const { cargarCita } = useAgendaStore();
  const { empleados, cargarEmpleados } = useEmpleadosStore();

  // Cargar empleados una sola vez
  useEffect(() => {
    cargarEmpleados();
  }, []);

  // 🔥 Notario
  const notarioNombre = cita.notario
    ? `${cita.notario.nombre} ${cita.notario.apellidos}`
    : cita.notario_id || "Notaría";

  // 🔥 Apoderado empleado
  const apoderadoObj = empleados.find(e => e.id === cita.apoderado_id);
  const apoderadoEmpleado = apoderadoObj
    ? `${apoderadoObj.nombre} ${apoderadoObj.apellidos}`
    : null;

  // 🔥 Apoderado final (prioridad CTN → empleado → id → —)
  const apoderadoNombre =
    cita.apoderado_s ||
    apoderadoEmpleado ||
    cita.apoderado_id ||
    "—";

  // 🔥 Tipo de firma traducido desde vc
  const tipoFirma =
    cita.vc === "SI" ? "Videoconferencia" :
    cita.vc === "NO" ? "Presencial" :
    "—";

  // 🔥 Observación del CTN
  const observacion = cita.observacion || "—";

  return (
    <GlassCard
      className="flex flex-col gap-2 cursor-pointer"
      onClick={() => cargarCita(cita.id)}
    >
      <div className="flex items-center gap-3">
        <IconAgenda size={26} />
        <h4 className="text-lg font-bold" style={{ color: "#1F3A5F" }}>
          {notarioNombre}
        </h4>
      </div>

      <p style={{ color: "#6A7A8C" }}>
        {cita.fecha} — {cita.hora_inicio} a {cita.hora_fin}
      </p>

      <p style={{ color: "#1F3A5F" }}>
        Tipo de firma: {tipoFirma}
      </p>

      <p style={{ color: "#1F3A5F" }}>
        Apoderado: {apoderadoNombre}
      </p>

      {observacion && (
        <p className="text-sm" style={{ color: "#6A7A8C" }}>
          {observacion}
        </p>
      )}

      <button
        className="btn btn-sm btn-primary mt-2"
        onClick={(e) => {
          e.stopPropagation();
          onEditarCita(cita.id);
        }}
      >
        Editar cita
      </button>
    </GlassCard>
  );
}
