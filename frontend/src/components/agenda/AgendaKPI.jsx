import GlassKPI from "../ui/GlassKPI.jsx";
import IconAgenda from "../icons/IconAgenda.jsx";

export default function AgendaKPI({ title, value }) {
  return (
    <GlassKPI
      title={title}
      value={value}
      icon={<IconAgenda size={28} />}
    />
  );
}
