import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Intranet() {
  const [noticias, setNoticias] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        setError(null);
        setLoading(true);

        const [resNoticias, resDocumentos] = await Promise.all([
          fetch("/api/intranet/noticias"),
          fetch("/api/intranet/documentos"),
        ]);

        if (!resNoticias.ok || !resDocumentos.ok) {
          throw new Error("Error cargando datos de intranet");
        }

        const dataNoticias = await resNoticias.json();
        const dataDocumentos = await resDocumentos.json();

        setNoticias(dataNoticias || []);
        setDocumentos(dataDocumentos || []);
      } catch (e) {
        console.error("Error cargando intranet", e);
        setError(e.message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, []);

  if (loading) {
    return (
      <div className="text-white/80">
        Cargando intranet…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-300">
        Error al cargar la intranet: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Noticias */}
      <section className="bg-white/10 rounded-2xl p-4 shadow-lg border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Noticias internas</h2>
          <Link
            to="/herramientas/utilidades/crear-noticia"
            className="text-sm px-3 py-1 rounded-lg bg-blue-500/80 text-white hover:bg-blue-500 transition"
          >
            Nueva noticia
          </Link>
        </div>

        {noticias.length === 0 ? (
          <p className="text-sm text-white/60">
            No hay noticias publicadas.
          </p>
        ) : (
          <ul className="space-y-3">
            {noticias.map((n) => (
              <li
                key={n.id}
                className="bg-white/5 rounded-xl p-3 border border-white/10"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white">
                    {n.titulo}
                  </span>
                  {n.fecha_publicacion && (
                    <span className="text-xs text-white/50">
                      {new Date(n.fecha_publicacion).toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/70">
                  {n.descripcion}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Documentos */}
      <section className="bg-white/10 rounded-2xl p-4 shadow-lg border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Documentos internos</h2>
          <Link
            to="/herramientas/utilidades/subir-documento"
            className="text-sm px-3 py-1 rounded-lg bg-green-500/80 text-white hover:bg-green-500 transition"
          >
            Subir documento
          </Link>
        </div>

        {documentos.length === 0 ? (
          <p className="text-sm text-white/60">
            No hay documentos disponibles.
          </p>
        ) : (
          <ul className="space-y-3">
            {documentos.map((d) => (
              <li
                key={d.id}
                className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-white">
                    {d.titulo}
                  </div>
                  {d.concepto && (
                    <div className="text-sm text-white/70">
                      {d.concepto}
                    </div>
                  )}
                </div>

                <a
                  href={`/api/intranet/documentos/descargar/${d.id}`}
                  className="text-xs px-3 py-1 rounded-lg bg-white/20 text-white hover:bg-white/30 transition"
                >
                  Descargar
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
