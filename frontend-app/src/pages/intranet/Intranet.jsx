import { useEffect, useState } from "react";

function Intranet() {
  const [noticias, setNoticias] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const [resNoticias, resDocumentos] = await Promise.all([
          fetch("/api/intranet/noticias"),
          fetch("/api/intranet/documentos"),
        ]);

        const dataNoticias = await resNoticias.json();
        const dataDocumentos = await resDocumentos.json();

        setNoticias(dataNoticias);
        setDocumentos(dataDocumentos);
      } catch (e) {
        console.error("Error cargando intranet", e);
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, []);

  if (loading) return <div>Cargando intranet…</div>;

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      <section>
        <h2 className="font-bold mb-2">Noticias</h2>
        <ul className="space-y-2">
          {noticias.map(n => (
            <li key={n.id} className="border p-2 rounded">
              <div className="font-semibold">{n.titulo}</div>
              <div className="text-sm text-gray-600">{n.descripcion}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-bold mb-2">Documentos</h2>
        <ul className="space-y-2">
          {documentos.map(d => (
            <li key={d.id} className="border p-2 rounded">
              <div className="font-semibold">{d.titulo}</div>
              <div className="text-sm text-gray-600">{d.concepto}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Intranet;
