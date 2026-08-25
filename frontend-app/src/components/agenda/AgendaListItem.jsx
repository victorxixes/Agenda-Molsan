import GlassListItem from "../ui/GlassListItem.jsx";
import IconAgenda from "../icons/IconAgenda.jsx";

export default function AgendaListItem({ cita, onClick }) {
  const notarioNombre = cita.notario
    ? `${cita.notario.nombre} ${cita.notario.apellidos}`
    : cita.notario_id || "Notaría";

  const apoderadoNombre = cita.apoderado
    ? `${cita.apoderado.nombre} ${cita.apoderado.apellidos}`
    : cita.apoderado_id || "—";

  return (
    <GlassListItem
      icon={<IconAgenda size={22} />}
      title={`${cita.hora_inicio} — ${cita.hora_fin}`}
      subtitle={`${notarioNombre} · Apoderado: ${apoderadoNombre}`}
      onClick={onClick}
    />
  );
}
