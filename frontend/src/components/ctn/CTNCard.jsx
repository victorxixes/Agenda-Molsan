import GlassCard from "../ui/GlassCard.jsx";
import IconIntranet from "../icons/IconIntranet.jsx";

export default function CTNCard({ titulo, valor }) {
  return (
    <GlassCard className="flex items-center gap-4">
      <IconIntranet size={26} />
      <div>
        <p className="font-semibold" style={{ color: "#6A7A8C" }}>{titulo}</p>
        <p className="text-xl font-bold" style={{ color: "#1F3A5F" }}>{valor}</p>
      </div>
    </GlassCard>
  );
}
