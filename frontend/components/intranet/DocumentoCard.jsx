import GlassCard from "../ui/GlassCard.jsx";
import IconDocumentos from "../icons/IconDocumentos.jsx";

export default function DocumentoCard({ documento }) {
  return (
    <GlassCard className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <IconDocumentos size={22} />
        <h4 className="text-lg font-bold" style={{ color: "#1F3A5F" }}>
          {documento.nombre}
        </h4>
      </div>

      <p className="text-xs" style={{ color: "#6A7A8C" }}>
        {documento.categoria}
      </p>

      {documento.descripcion && (
        <p className="text-sm" style={{ color: "#1F3A5F" }}>
          {documento.descripcion}
        </p>
      )}
    </GlassCard>
  );
}
