import { useEffect, useState } from "react";
import { useIntranet } from "../../hooks/useIntranet";

export default function Intranet() {
  const {
    documentos,
    noticias,
    cargarDocumentos,
    cargarNoticias,
    eliminarDocumento,
    eliminarNoticia,
    loading
  } = useIntranet();

  // Buscador global
  const [tipoVista, setTipoVista] = useState("todos"); // todos | noticias | documentos

  // Filtros documentos
  const [filtroConcepto, setFiltroConcepto] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  // Ordenación documentos
  const [orden, setOrden] = useState({ campo: "fecha", dir: "desc" });

  // Paginación documentos
  const [pagina, setPagina] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Modal PDF
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    cargarDocumentos();
    cargarNoticias();
  }, []);

  if (loading) return <p>Cargando intranet…</p>;

  // ⭐ Filtrar documentos
  const docsFiltrados = documentos.filter((d) => {
    const okConcepto =
      filtroConcepto === "" ||
      d.concepto.toLowerCase().includes(filtroConcepto.toLowerCase());

    const okFecha =
      filtroFecha === "" ||
      d.fecha.startsWith(filtroFecha);

    return okConcepto && okFecha;
  });

  // ⭐ Ordenar documentos
  const docsOrdenados = [...docsFiltrados].sort((a, b) => {
    const campo = orden.campo;
    const dir = orden.dir === "asc" ? 1 : -1;

    if (campo === "fecha") {
      return (new Date(a.fecha) - new Date(b.fecha)) * dir;
    }
    return a[campo].localeCompare(b[campo]) * dir;
  });

  const ordenar = (campo) => {
    setOrden((prev) => ({
      campo,
      dir: prev.campo === campo && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  // ⭐ Paginación documentos
  const totalPaginas = Math.ceil(docsOrdenados.length / pageSize);
  const docsVisibles = docsOrdenados.slice(
    (pagina - 1) * pageSize,
    pagina * pageSize
  );

  return (
    <div className="container-sj space-y-6">

      <div className="seg-card">
        <h1 className="seg-title">Intranet</h1>
        <p className="seg-desc">Documentos y noticias internas del ERP.</p>
      </div>

      {/* ⭐ Buscador global */}
      <div className="seg-card flex items-center gap-4">
        <select
          className="sj-input w-60"
          value={tipoVista}
          onChange={(e) => setTipoVista(e.target.value)}
        >
          <option value="todos">Mostrar todo</option>
          <option value="noticias">Solo noticias</option>
          <option value="documentos">Solo documentos</option>
        </select>
      </div>

      {/* ⭐ Layout en dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ⭐ Noticias (izquierda) */}
        {(tipoVista === "todos" || tipoVista === "noticias") && (
          <div className="seg-card space-y-4">
            <h2 className="text-xl font-bold mb-2">Noticias</h2>

            {noticias.length === 0 && (
              <p className="text-gray-500">No hay noticias.</p>
            )}

            {noticias.map((n) => (
              <div
                key={n.id}
                className="border rounded-lg p-4 bg-white shadow-sm space-y-2"
              >
                <h3 className="font-semibold text-lg">{n.titulo}</h3>
                <p className="text-gray-700">{n.concepto}</p>
                <p className="text-sm text-gray-500">
                  {new Date(n.fecha).toLocaleString("es-ES")}
                </p>

                <button
                  onClick={() => eliminarNoticia(n.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ⭐ Documentos (derecha) */}
        {(tipoVista === "todos" || tipoVista === "documentos") && (
          <div className="seg-card space-y-4">
            <h2 className="text-xl font-bold mb-2">Documentos</h2>

            {/* ⭐ Filtros */}
            <div className="grid grid-cols-2 gap-3">
              <input
                className="sj-input"
                placeholder="Filtrar por concepto..."
                value={filtroConcepto}
                onChange={(e) => setFiltroConcepto(e.target.value)}
              />

              <input
                type="date"
                className="sj-input"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
              />
            </div>

            {docsVisibles.length === 0 ? (
              <p className="text-gray-500">No hay documentos.</p>
            ) : (
              <table className="sj-table w-full text-sm">
                <thead>
                  <tr>
                    <th>ID</th>

                    <th
                      className="cursor-pointer"
                      onClick={() => ordenar("titulo")}
                    >
                      Título {orden.campo === "titulo" && (orden.dir === "asc" ? "↑" : "↓")}
                    </th>

                    <th>Concepto</th>

                    <th
                      className="cursor-pointer"
                      onClick={() => ordenar("fecha")}
                    >
                      Fecha {orden.campo === "fecha" && (orden.dir === "asc" ? "↑" : "↓")}
                    </th>

                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {docsVisibles.map((d) => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>{d.titulo}</td>
                      <td>{d.concepto}</td>
                      <td>{new Date(d.fecha).toLocaleString("es-ES")}</td>

                      <td className="flex gap-3">

                        {/* ⭐ Vista previa PDF */}
                        <button
                          onClick={() => setPdfUrl(d.fichero)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Ver PDF
                        </button>

                        <button
                          onClick={() => eliminarDocumento(d.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* ⭐ Paginación documentos */}
            <div className="flex items-center justify-between mt-4">
              <button
                className="sj-btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={pagina <= 1}
                onClick={() => setPagina((p) => p - 1)}
              >
                ← Anterior
              </button>

              <span className="text-sm text-gray-600">
                Página {pagina} de {totalPaginas}
              </span>

              <button
                className="sj-btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={pagina >= totalPaginas}
                onClick={() => setPagina((p) => p + 1)}
              >
                Siguiente →
              </button>

              <select
                className="sj-input w-32"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
                <option value={50}>50 por página</option>
              </select>
            </div>
          </div>
        )}

      </div>

      {/* ⭐ Modal PDF */}
      {pdfUrl && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setPdfUrl(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-4 w-[80vw] h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="Vista previa PDF"
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
}
