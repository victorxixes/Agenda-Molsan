export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`
        bg-white/70 backdrop-blur-md border border-neutral-200/60
        shadow-lg rounded-xl p-4 transition-all duration-300
        hover:shadow-xl ${className}
      `}
    >
      {children}
    </div>
  );
}
