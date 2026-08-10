import GlassCard from "../ui/GlassCard.jsx";

export default function NotarioCard({ notario }) {
  return (
    <GlassCard className="flex flex-col gap-2">
      <p className="font-bold text-lg" style={{ color: "#1F3A5F" }}>
        {notario.nombre}
      </p>
      <p className="text-sm" style={{ color: "#6A7A8C" }}>
        {notario.zona}
      </p>
    </GlassCard>
  );
}
