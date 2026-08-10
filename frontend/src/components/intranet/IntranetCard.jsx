import GlassCard from "../ui/GlassCard.jsx";
import IconIntranet from "../icons/IconIntranet.jsx";

export default function IntranetCard({ title, description }) {
  return (
    <GlassCard className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <IconIntranet size={24} />
        <h4 className="text-lg font-bold" style={{ color: "#1F3A5F" }}>
          {title}
        </h4>
      </div>

      {description && (
        <p className="text-sm" style={{ color: "#6A7A8C" }}>
          {description}
        </p>
      )}
    </GlassCard>
  );
}
