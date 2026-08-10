import GlassListItem from "../ui/GlassListItem.jsx";
import IconAgenda from "../icons/IconAgenda.jsx";

export default function AgendaListItem({ cita, onClick }) {
  return (
    <GlassListItem
      icon={<IconAgenda size={22} />}
      title={`${cita.hora_inicio} — ${cita.hora_fin}`}
      subtitle={cita.notario?.nombre || "Notaría"}
      onClick={onClick}
    />
  );
}
