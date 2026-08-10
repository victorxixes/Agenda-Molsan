import GlassCard from "../ui/GlassCard.jsx";
import IconNoticias from "../icons/IconNoticias.jsx";

export default function NoticiaCard({ noticia }) {
  return (
    <div className="glass-card p-4 rounded-xl shadow-md hover:shadow-lg transition-all">
      <span className="text-xs text-gray-400">
        {new Date(noticia.fecha_publicacion).toLocaleString()}
      </span>

      <h3 className="text-lg font-semibold mt-1">
        {noticia.titulo}
      </h3>

      <p className="text-gray-300 mt-2">
        {noticia.descripcion}
      </p>

      {noticia.fichero && (
        <a
          href={noticia.fichero}
          target="_blank"
          className="text-blue-400 text-sm mt-3 inline-block hover:underline"
        >
          Ver archivo adjunto
        </a>
      )}
    </div>
  );
}
