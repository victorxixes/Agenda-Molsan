import React, { useEffect, useState } from "react";
import { useIntranetStore } from "../../store/intranetStore";

import GlassSectionTitle from "../../components/ui/GlassSectionTitle";
import IconNoticias from "../../components/icons/IconNoticias";
import IconDocumentos from "../../components/icons/IconDocumentos";

import NoticiasFeed from "../../components/intranet/NoticiasFeed";
import DocumentosTable from "../../components/intranet/DocumentosTable";
import DocumentosEditModal from "../../components/intranet/DocumentosEditModal";
import NoticiasEditModal from "../../components/intranet/NoticiasEditModal";

export default function IntranetPage() {
  const {
    noticias,
    documentos,
    cargarNoticias,
    cargarDocumentos,
    eliminarDocumento,
    actualizarDocumento,
    actualizarNoticia
  } = useIntranetStore();

  // Modal edición documentos
  const [editDocOpen, setEditDocOpen] = useState(false);
  const [docSeleccionado, setDocSeleccionado] = useState(null);

  // Modal edición noticias
  const [editNoticiaOpen, setEditNoticiaOpen] = useState(false);
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);

  useEffect(() => {
    cargarNoticias();
    cargarDocumentos();
  }, []);

  const handleEditDocumento = (doc) => {
    setDocSeleccionado(doc);
    setEditDocOpen(true);
  };

  const handleEditNoticia = (noticia) => {
    setNoticiaSeleccionada(noticia);
    setEditNoticiaOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

        {/* Noticias */}
        <section className="max-h-[80vh] overflow-y-auto">
          <GlassSectionTitle
            icon={<IconNoticias size={26} />}
            title="Noticias corporativas"
          />

          <NoticiasFeed
            noticias={noticias}
            onEdit={handleEditNoticia}
          />
        </section>

        {/* Documentos */}
        <section className="max-h-[80vh] overflow-y-auto">
          <GlassSectionTitle
            icon={<IconDocumentos size={26} />}
            title="Documentos internos"
          />

          <DocumentosTable
            documentos={documentos}
            onEdit={handleEditDocumento}
            onDelete={(id) => eliminarDocumento(id)}
          />
        </section>

      </div>

      {/* Modal edición documentos */}
      <DocumentosEditModal
        open={editDocOpen}
        onClose={() => setEditDocOpen(false)}
        documento={docSeleccionado}
        onSave={(doc) => actualizarDocumento(doc)}
      />

      {/* Modal edición noticias */}
      <NoticiasEditModal
        open={editNoticiaOpen}
        onClose={() => setEditNoticiaOpen(false)}
        noticia={noticiaSeleccionada}
        onSave={(n) => actualizarNoticia(n)}
      />
    </>
  );
}
