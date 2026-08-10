import GlassCard from "../ui/GlassCard.jsx";
import IconSistema from "../icons/IconSistema.jsx";

export default function SistemaCard({ titulo, descripcion }) {
  return (
    <GlassCard className="flex items-center gap-3">
      <IconSistema size={24} />
      <div>
        <p className="font-bold" style={{ color: "#1F3A5F" }}>{titulo}</p>
        <p className="text-sm" style={{ color: "#6A7A8C" }}>{descripcion}</p>
      </div>
    </GlassCard>
  );
}
