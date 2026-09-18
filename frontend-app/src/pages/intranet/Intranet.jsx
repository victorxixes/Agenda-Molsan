import { useEffect, useState, useMemo, useCallback } from "react";
import { useIntranet } from "../../hooks/useIntranet";

/**
 * Intranet — SJ‑2026 Premium
 * - Documentos + Noticias
 * - Filtros avanzados
 * - Ordenación estable
 * - Paginación premium
 * - Modal PDF glass‑UI
 */

export default function Intranet() {
  const {
    documentos,
    noticias,
    cargarDocumentos,
    cargarNoticias,
    eliminarDocumento,
    eliminarNoticia,
    loading,
  } = useIntranet();

  const [tipoVista, setTipoVista] = useState("todos");
  const [filtroConcepto, setFiltroConcepto] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [orden, setOrden] = useState({ campo: "fecha", dir: "desc" });
  const [pagina, setPagina] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDocumentos();
    cargarNoticias();
  }, [cargarDocumentos, cargarNoticias]);

  if (loading) {
    return (
      <p className="text-white/70 animate-pulse p-6">
        Cargando intranet…
      </p>
    );
  }

  // FILTROS DOCUMENTOS
  const docsFiltrados = useMemo(() => {
    const lista = Array.isArray(documentos) ? documentos : [];

    return lista.filter((d) => {
      const concepto = typeof d.concepto === "string"
        ? d.concepto
        : String(d.concepto || "");

      const okConcepto =
        !filtroConcepto ||
        concepto.toLowerCase().includes(filtroConcepto.toLowerCase());

      const fechaStr = typeof d.fecha_publicacion === "string"
        ? d.fecha_publicacion
        : String(d.fecha_publicacion || "");

      const fechaObj = new Date(fechaStr);
      const okFecha =
        !filtroFecha ||
        (!Number.isNaN(fechaObj.getTime()) &&
          fechaObj.toISOString().slice(0, 10) === filtroFecha);

      return okConcepto && okFecha;
    });
  }, [documentos, filtroConcepto, filtroFecha]);

  // ORDENACIÓN DOCUMENTOS
  const docsOrdenados = useMemo(() => {
    const campo = orden.campo;
    const dir = orden.dir === "asc" ? 1 : -1;

    return [...docsFiltrados].sort((a, b) => {
      if (campo === "fecha") {
        const aFecha = new Date(a.fecha_publicacion || 0).getTime();
        const bFecha = new Date(b.fecha_publicacion || 0).getTime();
        return (aFecha - bFecha) * dir;
      }

      const aVal = typeof a[campo] === "string"
        ? a[campo]
        : String(a[campo] || "");

      const bVal = typeof b[campo] === "string"
        ? b[campo]
        : String(b[campo] || "");

      return aVal.localeCompare(bVal) * dir;
    });
  }, [docsFiltrados, orden]);

  const ordenar = useCallback((campo) => {
    setOrden((prev) => ({
      campo,
      dir: prev.campo === campo && prev.dir === "asc" ? "desc" : "asc",
    }));
  }, []);

  // PAGINACIÓN DOCUMENTOS
  const totalPaginas = useMemo(
    () => Math.max(1, Math.ceil(docsOrdenados.length / pageSize)),
    [docsOrdenados.length, pageSize]
  );

  // Si la página actual queda fuera de rango, volver a 1
  useEffect(() => {
    if (pagina > totalPaginas) {
      setPagina(1);
    }
  }, [totalPaginas, pagina]);

  const docsVisibles = useMemo(() => {
    return docsOrdenados.slice((pagina - 1) * pageSize, pagina * pageSize);
  }, [docsOrdenados, pagina, pageSize]);

  // Noticias seguras (sin keys aleatorias)
  const noticiasSeguras = Array.isArray(noticias)
    ? noticias.filter((n) => n && typeof n.id !== "undefined")
    : [];

  return (
    <div className="p-6 space-y-8 text-white animate-fade-in">

      {/* HEADER PREMIUM */}
      <div className="
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
        p-6 shadow-xl
      ">
        <h1 className="text-3xl font-bold drop-shadow">Intranet</h1>
        <p className="text-white/70 text-sm mt-1">
          Documentos y noticias internas del ERP.
        </p>
      </div>

      {/* BUSCADOR GLOBAL PREMIUM */}
      <div className="
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
        p-6 shadow-xl flex items-center gap-4
      ">
        <select
          className="
            bg-white/10 border border-white/20 rounded-xl px-4 py-2
            text-white focus:ring-2 focus:ring-blue-400
          "
          value={tipoVista}
          onChange={(e) => setTipoVista(e.target.value)}
        >
          <option value="todos">Mostrar todo</option>
          <option value="noticias">Solo noticias</option>
          <option value="documentos">Solo documentos</option>
        </select>
      </div>

      {/* LAYOUT PREMIUM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* NOTICIAS PREMIUM */}
        {(tipoVista === "todos" || tipoVista === "noticias") && (
          <div className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            p-6 shadow-xl space-y-4
          ">
            <h2 className="text-2xl font-semibold drop-shadow mb-2">
              Noticias
            </h2>

            {noticiasSeguras.length === 0 && (
              <p className="text-white/70">No hay noticias.</p>
            )}

            {noticiasSeguras.map((n) => (
              <div
                key={String(n.id)}   {/* 🔥 Key estable y segura */}
                className="
                  bg-white/5 border border-white/20 rounded-xl p-4
                  shadow-md backdrop-blur-md space-y-2
                "
              >
                <h3 className="font-semibold text-xl text-white drop-shadow">
                  {typeof n.titulo === "string" ? n.titulo : String(n.titulo || "")}
                </h3>

                <p className="text-white/80">
                  {typeof n.descripcion === "string"
                    ? n.descripcion
                    : String(n.descripcion || "")}
                </p>

                <p className="text-sm text-white/60">
                  {n.fecha_publicacion &&
                  !Number.isNaN(new Date(n.fecha_publicacion).getTime())
                    ? new Date(n.fecha_publicacion).toLocaleString("es-ES")
                    : "Sin fecha"}
                </p>

                <button
                  onClick={() => eliminarNoticia(n.id)}
                  className="
                    text-red-400 hover:text-red-300 text-sm
                    transition
                  "
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* DOCUMENTOS PREMIUM */}
{(tipoVista === "todos" || tipoVista === "documentos") && (
  <div className="
    bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
    p-6 shadow-xl space-y-4
  ">
    <h2 className="text-2xl font-semibold drop-shadow mb-2">
      Documentos
    </h2>

    {/* FILTROS PREMIUM */}
    <div className="grid grid-cols-2 gap-3">
      <input
        className="
          bg-white/10 border border-white/20 rounded-xl px-3 py-2
          text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
        "
        placeholder="Filtrar por concepto..."
        value={filtroConcepto}
        onChange={(e) => setFiltroConcepto(e.target.value)}
      />

      <input
        type="date"
        className="
          bg-white/10 border border-white/20 rounded-xl px-3 py-2
          text-white focus:ring-2 focus:ring-blue-400
        "
        value={filtroFecha}
        onChange={(e) => setFiltroFecha(e.target.value)}
      />
    </div>

    {docsVisibles.length === 0 ? (
      <p className="text-white/70">No hay documentos.</p>
    ) : (
      <table className="w-full text-sm">
        <thead>
          <tr className="text-white/70 border-b border-white/10">
            <th>ID</th>

            <th
              className="cursor-pointer"
              onClick={() => ordenar("titulo")}
            >
              Título{" "}
              {orden.campo === "titulo" &&
                (orden.dir === "asc" ? "↑" : "↓")}
            </th>

            <th>Concepto</th>

            <th
              className="cursor-pointer"
              onClick={() => ordenar("fecha")}
            >
              Fecha{" "}
              {orden.campo === "fecha" &&
                (orden.dir === "asc" ? "↑" : "↓")}
            </th>

            <th></th>
          </tr>
        </thead>

        <tbody>
          {docsVisibles.map((d) => {
            const id =
              typeof d.id === "number" || typeof d.id === "string"
                ? String(d.id)
                : "-";

            const titulo =
              typeof d.titulo === "string"
                ? d.titulo
                : String(d.titulo || "-");

            const concepto =
              typeof d.concepto === "string"
                ? d.concepto
                : String(d.concepto || "-");

            const fechaValida =
              d.fecha_publicacion &&
              !Number.isNaN(new Date(d.fecha_publicacion).getTime());

            const fichero =
              typeof d.fichero === "string" ? d.fichero : null;

            return (
              <tr key={id} className="border-b border-white/10">
                <td className="py-2">{id}</td>
                <td className="py-2">{titulo}</td>
                <td className="py-2">{concepto}</td>

                <td className="py-2">
                  {fechaValida
                    ? new Date(d.fecha_publicacion).toLocaleString("es-ES")
                    : "Sin fecha"}
                </td>

                <td className="py-2 flex gap-3">
                  <button
                    onClick={() => fichero && setPdfUrl(fichero)}
                    className="
                      text-blue-400 hover:text-blue-300 text-sm
                      transition
                    "
                  >
                    Ver PDF
                  </button>

                  <button
                    onClick={() => eliminarDocumento(id)}
                    className="
                      text-red-400 hover:text-red-300 text-sm
                      transition
                    "
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}

    {/* PAGINACIÓN PREMIUM */}
    <div className="flex items-center justify-between mt-4">
      <button
        className="
          px-3 py-2 rounded-xl bg-white/10 border border-white/20
          text-white hover:bg-white/20 transition
        "
        disabled={pagina <= 1}
        onClick={() => setPagina((p) => p - 1)}
      >
        ← Anterior
      </button>

      <span className="text-white/70 text-sm">
        Página {pagina} de {totalPaginas}
      </span>

      <button
        className="
          px-3 py-2 rounded-xl bg-white/10 border border-white/20
          text-white hover:bg-white/20 transition
        "
        disabled={pagina >= totalPaginas}
        onClick={() => setPagina((p) => p + 1)}
      >
        Siguiente →
      </button>

      <select
        className="
          bg-white/10 border border-white/20 rounded-xl px-3 py-2
          text-white focus:ring-2 focus:ring-blue-400
        "
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

{/* MODAL PDF PREMIUM */}
{pdfUrl && (
  <div
    className="
      fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center
      justify-center z-50 animate-fade-in
    "
    onClick={() => setPdfUrl(null)}
  >
    <div
      className="
        bg-white rounded-2xl shadow-2xl p-4 w-[80vw] h-[80vh]
      "
      onClick={(e) => e.stopPropagation()}
    >
      <iframe
        src={typeof pdfUrl === "string" ? pdfUrl : ""}
        className="w-full h-full rounded-xl"
        title="Vista previa PDF"
      ></iframe>
    </div>
  </div>
)}

</div>
