import { useEffect } from "react";
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

  useEffect(() => {
    cargarDocumentos();
    cargarNoticias();
  }, []);

  if (loading) return <p>Cargando intranet…</p>;

  return (
    <div className="container-sj space-y-6">

      <div className="seg-card">
        <h1 className="seg-title">Intranet</h1>
        <p className="seg-desc">Documentos y noticias internas del ERP.</p>
      </div>

      {/* ⭐ Layout en dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ⭐ Noticias (izquierda) */}
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

        {/* ⭐ Documentos (derecha) */}
        <div className="seg-card">
          <h2 className="text-xl font-bold mb-2">Documentos</h2>

          {documentos.length === 0 ? (
            <p className="text-gray-500">No hay documentos.</p>
          ) : (
            <table className="sj-table w-full text-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Concepto</th>
                  <th>Fecha</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {documentos.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.titulo}</td>
                    <td>{d.concepto}</td>
                    <td>{new Date(d.fecha).toLocaleString("es-ES")}</td>
                    <td>
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
        </div>

      </div>
    </div>
  );
}
