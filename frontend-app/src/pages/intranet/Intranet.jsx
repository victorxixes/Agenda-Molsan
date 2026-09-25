import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import axios from "../../api/axios";

function Intranet() {
  const { token, authReady, empleado } = useAuthStore();

  const esAdmin = empleado?.rol?.nombre === "admin";

  const [noticias, setNoticias] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authReady || !token) return;

    async function cargar() {
      try {
        setLoading(true);
        setError(null);

        // Axios añade automáticamente el token desde el interceptor
        const [resNoticias, resDocumentos] = await Promise.all([
          axios.get("/noticias"),
          axios.get("/documentos")
        ]);

        setNoticias(Array.isArray(resNoticias.data) ? resNoticias.data : []);
        setDocumentos(Array.isArray(resDocumentos.data) ? resDocumentos.data : []);
      } catch (e) {
        console.error("Error cargando intranet", e);
        setError("Error cargando datos de intranet");
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, [authReady, token]);

  // ELIMINAR NOTICIA
  async function eliminarNoticia(id) {
    try {
      await axios.delete(`/noticias/${id}`);
      setNoticias(noticias.filter(n => n.id !== id));
    } catch {
      alert("Error eliminando noticia");
    }
  }

  // ELIMINAR DOCUMENTO
  async function eliminarDocumento(id) {
    try {
      await axios.delete(`/documentos/${id}`);
      setDocumentos(documentos.filter(d => d.id !== id));
    } catch {
      alert("Error eliminando documento");
    }
  }

  // ESTADOS DE CARGA
  if (!authReady) {
    return <div className="text-white/80">Cargando sesión…</div>;
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
                    href={`${import.meta.env.VITE_API_URL}/documentos/descargar/${d.id}`}
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

export default Intranet;
