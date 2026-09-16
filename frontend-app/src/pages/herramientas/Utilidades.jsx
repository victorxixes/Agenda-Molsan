import { Link } from "react-router-dom";

export default function Utilidades() {
  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold text-white drop-shadow mb-4">
        Utilidades del sistema
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card
          titulo="Importar CTN"
          descripcion="Importar fichero Excel con notarias."
          link="/herramientas/importar-ctn"
        />

        <Card
          titulo="Crear noticia"
          descripcion="Publicar una noticia en la intranet."
          link="/herramientas/utilidades/crear-noticia"
        />

        <Card
          titulo="Subir documento"
          descripcion="Subir documentos a la intranet."
          link="/herramientas/utilidades/subir-documento"
        />

      </div>
    </div>
  );
}

function Card({ titulo, descripcion, link }) {
  return (
    <Link
      to={link}
      className="
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
        p-6 shadow-xl hover:bg-white/20 transition block
      "
    >
      <h2 className="text-xl font-semibold text-white drop-shadow mb-2">
        {titulo}
      </h2>
      <p className="text-sm text-white/70">{descripcion}</p>
    </Link>
  );
}
