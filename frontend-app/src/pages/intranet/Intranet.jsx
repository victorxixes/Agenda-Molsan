import { useEffect } from "react";
import { useIntranet } from "../../hooks/useIntranet";
import { useIntranetWS } from "../../hooks/useIntranetWS";
import DocumentosTable from "../../components/intranet/DocumentosTable";
import NoticiasFeed from "../../components/intranet/NoticiasFeed";

export default function Intranet() {
  const { cargarDocumentos, cargarNoticias } = useIntranet();

  useIntranetWS();

  useEffect(() => {
    cargarDocumentos();
    cargarNoticias();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Intranet</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Documentos</h2>
        <DocumentosTable />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Noticias</h2>
        <NoticiasFeed />
      </section>
    </div>
  );
}

