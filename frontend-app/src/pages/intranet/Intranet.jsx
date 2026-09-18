import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";

const API = "https://agenda-intranet-b.onrender.com/api/intranet";

export default function Intranet() {
  const { token, usuario } = useAuthStore();

  const esAdmin = usuario?.rol?.nombre === "admin";

  const [noticias, setNoticias] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        setLoading(true);
        setError(null);

        const [resNoticias, resDocumentos] = await Promise.all([
          fetch(`${API}/noticias`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetch(`${API}/documentos`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
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
  }, [token]);

  // ELIMINAR NOTICIA
  async function eliminarNoticia(id) {
    const res = await fetch(`${API}/noticias/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      return alert("Error eliminando noticia");
    }

    setNoticias(noticias.filter(n => n.id !== id));
  }

  // ELIMINAR DOCUMENTO
  async function eliminarDocumento(id) {
    const res = await fetch(`${API}/documentos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      return alert("Error eliminando documento");
    }

    setDocumentos(documentos.filter(d => d.id !== id));
  }

  if (loading) {
    return <div className="text-white/80">Cargando intranet…</div>;
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
        <h2 className="text-lg font-semibold text-white mb-3">
          Noticias internas
        </h2>

        {noticias.length === 0 ? (
          <p className="text-sm text-white/60">No hay noticias publicadas.</p>
        ) : (
          <ul className="space-y-3">
            {noticias.map((n) => (
              <li
                key={n.id}
                className="bg-white/5 rounded-xl p-3 border border-white/10"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white">{n.titulo}</span>

                  {n.fecha_publicacion && (
                    <span className="text-xs text-white/50">
                      {new Date(n.fecha_publicacion).toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-sm text-white/70">{n.descripcion}</p>

                {esAdmin && (
                  <button
                    onClick={() => eliminarNoticia(n.id)}
                    className="text-xs px-3 py-1 rounded-lg bg-red-600/70 text-white hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Documentos */}
      <section className="bg-white/10 rounded-2xl p-4 shadow-lg border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-3">
          Documentos internos
        </h2>

        {documentos.length === 0 ? (
          <p className="text-sm text-white/60">No hay documentos disponibles.</p>
        ) : (
          <ul className="space-y-3">
            {documentos.map((d) => (
              <li
                key={d.id}
                className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-white">{d.titulo}</div>

                  {d.concepto && (
                    <div className="text-sm text-white/70">{d.concepto}</div>
                  )}
                </div>

                <div className="flex gap-2">
                  <a
                    href={`${API}/documentos/descargar/${d.id}`}
                    className="text-xs px-3 py-1 rounded-lg bg-white/20 text-white hover:bg-white/30 transition"
                  >
                    Descargar
                  </a>

                  {esAdmin && (
                    <button
                      onClick={() => eliminarDocumento(d.id)}
                      className="text-xs px-3 py-1 rounded-lg bg-red-600/70 text-white hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
