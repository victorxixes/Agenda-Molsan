import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";

const API = "https://agenda-intranet-b.onrender.com/api/intranet";

export default function Intranet() {
  const [noticias, setNoticias] = useState([]);
  const [documentos, setDocumentos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [conceptoFiltro, setConceptoFiltro] = useState("");

  // Paginación
  const [paginaNoticias, setPaginaNoticias] = useState(0);
  const [paginaDocumentos, setPaginaDocumentos] = useState(0);
  const PAGE_SIZE = 10;

  // Vista detallada
  const [detalleNoticia, setDetalleNoticia] = useState(null);
  const [detalleDocumento, setDetalleDocumento] = useState(null);

  const { token, user } = useAuthStore();
  const esAdmin = user?.rol === "admin";

  async function cargar() {
    try {
      setLoading(true);
      setError(null);

      const [resNoticias, resDocumentos] = await Promise.all([
        fetch(`${API}/noticias`),
        fetch(`${API}/documentos`)
      ]);

      if (!resNoticias.ok || !resDocumentos.ok) {
        throw new Error("Error cargando datos de intranet");
      }

      setNoticias(await resNoticias.json());
      setDocumentos(await resDocumentos.json());
    } catch (e) {
      console.error("Error cargando intranet", e);
      setError(e.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  // -----------------------------
  // ELIMINAR NOTICIA
  // -----------------------------
  async function eliminarNoticia(id) {
    if (!esAdmin) return alert("No tienes permisos para eliminar noticias.");

    const res = await fetch(`${API}/noticias/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) return alert("Error eliminando noticia.");

    setNoticias(noticias.filter(n => n.id !== id));
  }

  // -----------------------------
  // ELIMINAR DOCUMENTO
  // -----------------------------
  async function eliminarDocumento(id) {
    if (!esAdmin) return alert("No tienes permisos para eliminar documentos.");

    const res = await fetch(`${API}/documentos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) return alert("Error eliminando documento.");

    setDocumentos(documentos.filter(d => d.id !== id));
  }

  // -----------------------------
  // FILTROS
  // -----------------------------
  const noticiasFiltradas = noticias.filter(n => {
    const coincideTexto =
      n.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      n.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    const coincideFecha = fechaFiltro
      ? n.fecha_publicacion?.startsWith(fechaFiltro)
      : true;

    return coincideTexto && coincideFecha;
  });

  const documentosFiltrados = documentos.filter(d => {
    const coincideTexto =
      d.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      d.concepto?.toLowerCase().includes(busqueda.toLowerCase());

    const coincideConcepto = conceptoFiltro
      ? d.concepto?.toLowerCase().includes(conceptoFiltro.toLowerCase())
      : true;

    const coincideFecha = fechaFiltro
      ? d.fecha?.startsWith(fechaFiltro)
      : true;

    return coincideTexto && coincideConcepto && coincideFecha;
  });

  // -----------------------------
  // PAGINACIÓN
  // -----------------------------
  const noticiasPaginadas = noticiasFiltradas.slice(
    paginaNoticias * PAGE_SIZE,
    paginaNoticias * PAGE_SIZE + PAGE_SIZE
  );

  const documentosPaginados = documentosFiltrados.slice(
    paginaDocumentos * PAGE_SIZE,
    paginaDocumentos * PAGE_SIZE + PAGE_SIZE
  );

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
    <div className="space-y-6">

      {/* FILTROS */}
      <div className="bg-white/10 p-4 rounded-2xl border border-white/10 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Buscar noticias o documentos..."
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/40"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaNoticias(0);
            setPaginaDocumentos(0);
          }}
        />

        <input
          type="date"
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white"
          value={fechaFiltro}
          onChange={(e) => {
            setFechaFiltro(e.target.value);
            setPaginaNoticias(0);
            setPaginaDocumentos(0);
          }}
        />

        <input
          type="text"
          placeholder="Filtrar por concepto (documentos)"
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/40"
          value={conceptoFiltro}
          onChange={(e) => {
            setConceptoFiltro(e.target.value);
            setPaginaDocumentos(0);
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* NOTICIAS */}
        <section className="bg-white/10 rounded-2xl p-4 shadow-lg border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-3">
            Noticias internas
          </h2>

          {noticiasFiltradas.length === 0 ? (
            <p className="text-sm text-white/60">No hay noticias.</p>
          ) : (
            <ul className="space-y-3">
              {noticiasPaginadas.map((n) => (
                <li
                  key={n.id}
                  className="bg-white/5 rounded-xl p-3 border border-white/10 cursor-pointer hover:bg-white/10 transition"
                  onClick={() => setDetalleNoticia(n)}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarNoticia(n.id);
                      }}
                      className="mt-2 text-xs px-3 py-1 rounded-lg bg-red-600/70 text-white hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* PAGINACIÓN NOTICIAS */}
          <div className="flex justify-between mt-3 text-white/70 text-sm">
            <button
              disabled={paginaNoticias === 0}
              onClick={() => setPaginaNoticias(paginaNoticias - 1)}
              className="px-3 py-1 bg-white/10 rounded-lg disabled:opacity-40"
            >
              ←
            </button>

            <span>Página {paginaNoticias + 1}</span>

            <button
              disabled={(paginaNoticias + 1) * PAGE_SIZE >= noticiasFiltradas.length}
              onClick={() => setPaginaNoticias(paginaNoticias + 1)}
              className="px-3 py-1 bg-white/10 rounded-lg disabled:opacity-40"
            >
              →
            </button>
          </div>
        </section>

        {/* DOCUMENTOS */}
        <section className="bg-white/10 rounded-2xl p-4 shadow-lg border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-3">
            Documentos internos
          </h2>

          {documentosFiltrados.length === 0 ? (
            <p className="text-sm text-white/60">No hay documentos.</p>
          ) : (
            <ul className="space-y-3">
              {documentosPaginados.map((d) => (
                <li
                  key={d.id}
                  className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 transition"
                  onClick={() => setDetalleDocumento(d)}
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
                      onClick={(e) => e.stopPropagation()}
                    >
                      Descargar
                    </a>

                    {esAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          eliminarDocumento(d.id);
                        }}
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

          {/* PAGINACIÓN DOCUMENTOS */}
          <div className="flex justify-between mt-3 text-white/70 text-sm">
            <button
              disabled={paginaDocumentos === 0}
              onClick={() => setPaginaDocumentos(paginaDocumentos - 1)}
              className="px-3 py-1 bg-white/10 rounded-lg disabled:opacity-40"
            >
              ←
            </button>

            <span>Página {paginaDocumentos + 1}</span>

            <button
              disabled={(paginaDocumentos + 1) * PAGE_SIZE >= documentosFiltrados.length}
              onClick={() => setPaginaDocumentos(paginaDocumentos + 1)}
              className="px-3 py-1 bg-white/10 rounded-lg disabled:opacity-40"
            >
              →
            </button>
          </div>
        </section>
      </div>

      {/* MODAL DETALLE NOTICIA */}
      {detalleNoticia && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 w-full max-w-lg text-white shadow-xl">
            <h3 className="text-xl font-bold mb-2">{detalleNoticia.titulo}</h3>
            <p className="text-white/70 mb-4">{detalleNoticia.descripcion}</p>

            {detalleNoticia.fecha_publicacion && (
              <p className="text-xs text-white/50 mb-4">
                Publicado: {new Date(detalleNoticia.fecha_publicacion).toLocaleString()}
              </p>
            )}

            <button
              onClick={() => setDetalleNoticia(null)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DOCUMENTO */}
      {detalleDocumento && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 w-full max-w-lg text-white shadow-xl">
            <h3 className="text-xl font-bold mb-2">{detalleDocumento.titulo}</h3>

            {detalleDocumento.concepto && (
              <p className="text-white/70 mb-4">{detalleDocumento.concepto}</p>
            )}

            <a
              href={`${API}/documentos/descargar/${detalleDocumento.id}`}
              className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white block text-center mb-4"
            >
              Descargar documento
            </a>

            <button
              onClick={() => setDetalleDocumento(null)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
