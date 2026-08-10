import GlassCard from "../ui/GlassCard.jsx";

export default function FirmaCard({ firma }) {
  return (
    <GlassCard className="flex flex-col gap-2">
      <p className="font-bold" style={{ color: "#1F3A5F" }}>
        {firma.tipo}
      </p>
      <p className="text-sm" style={{ color: "#6A7A8C" }}>
        {firma.fecha}
      </p>
    </GlassCard>
  );
}
