export default function GlassSectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-3 my-4">
      {icon}
      <h3 className="text-xl font-bold" style={{ color: "#1F3A5F" }}>
        {title}
      </h3>
    </div>
  );
}
