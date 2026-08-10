export default function GlassListItem({ icon, title, subtitle, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        flex items-center gap-4 p-3 rounded-xl cursor-pointer
        bg-white/60 backdrop-blur-md border border-neutral-200/60
        shadow-md hover:shadow-xl transition-all duration-300
      "
    >
      <div>{icon}</div>

      <div>
        <p className="font-semibold" style={{ color: "#1F3A5F" }}>
          {title}
        </p>
        {subtitle && (
          <p className="text-sm" style={{ color: "#6A7A8C" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
