import GlassCard from "../ui/GlassCard.jsx";
import IconAgenda from "../icons/IconAgenda.jsx";
import { useAgendaStore } from "../../store/agendaStore";

const estadoIcono = {
  Confirmada: "🟢",
  Pendiente: "🟡",
  Cancelada: "🔴",
  Finalizada: "🔵",
};

export default function AgendaCard({ cita }) {
  const { setCitaActual } = useAgendaStore();

  return (
    <GlassCard
      className="flex flex-col gap-2 cursor-pointer"
      onClick={() => setCitaActual(cita)}
    >
      <div className="flex items-center gap-3">
        <IconAgenda size={26} />
        <h4 className="text-lg font-bold" style={{ color: "#1F3A5F" }}>
          {cita.notario
            ? `${cita.notario.nombre} ${cita.notario.apellidos}`
            : "Notaría"}
        </h4>
      </div>

      <p style={{ color: "#6A7A8C" }}>
        {cita.fecha} — {cita.hora_inicio} a {cita.hora_fin}
      </p>

      <p style={{ color: "#1F3A5F" }}>
        Tipo de firma: {cita.tipo_firma || "—"}
      </p>

      <p style={{ color: "#1F3A5F" }}>
        Apoderado: {cita.apoderado
          ? `${cita.apoderado.nombre} ${cita.apoderado.apellidos}`
          : "Sin asignar"}
      </p>

      <p className="flex items-center gap-2 text-sm">
        <span>{estadoIcono[cita.estado] || "⚪"}</span>
        <span className="font-semibold" style={{ color: "#1F3A5F" }}>
          {cita.estado}
        </span>
      </p>

      {cita.observaciones && (
        <p className="text-sm" style={{ color: "#6A7A8C" }}>
          {cita.observaciones}
        </p>
      )}
    </GlassCard>
  );
}
