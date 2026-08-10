export default function GlassKPI({ title, value, icon }) {
  return (
    <div
      className="
        bg-white/70 backdrop-blur-md border border-neutral-200/60
        shadow-lg rounded-xl p-4 flex items-center gap-4
        hover:shadow-xl transition-all duration-300
      "
    >
      <div>{icon}</div>

      <div>
        <p className="text-sm font-semibold" style={{ color: "#6A7A8C" }}>
          {title}
        </p>
        <p className="text-2xl font-bold" style={{ color: "#1F3A5F" }}>
          {value}
        </p>
      </div>
    </div>
  );
}
