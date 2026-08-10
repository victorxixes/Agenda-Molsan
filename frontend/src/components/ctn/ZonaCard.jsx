import GlassCard from "../ui/GlassCard.jsx";

export default function ZonaCard({ zona }) {
  return (
    <GlassCard>
      <p className="font-bold text-lg" style={{ color: "#1F3A5F" }}>
        {zona.nombre}
      </p>
    </GlassCard>
  );
}
