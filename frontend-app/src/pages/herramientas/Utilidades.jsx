import { Link } from "react-router-dom";

export default function Utilidades() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Utilidades del sistema</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Link
          to="/herramientas/importar-ctn"
          className="border rounded p-4 bg-white shadow hover:bg-gray-50"
        >
          <h2 className="text-lg font-semibold mb-2">Importar CTN</h2>
          <p className="text-sm text-gray-600">
            Importar fichero Excel con notarias.
          </p>
        </Link>

        <Link
          to="/herramientas/utilidades/crear-noticia"
          className="border rounded p-4 bg-white shadow hover:bg-gray-50"
        >
          <h2 className="text-lg font-semibold mb-2">Crear noticia</h2>
          <p className="text-sm text-gray-600">
            Publicar una noticia en la intranet.
          </p>
        </Link>

        <Link
          to="/herramientas/utilidades/subir-documento"
          className="border rounded p-4 bg-white shadow hover:bg-gray-50"
        >
          <h2 className="text-lg font-semibold mb-2">Subir documento</h2>
          <p className="text-sm text-gray-600">
            Subir documentos a la intranet.
          </p>
        </Link>

      </div>
    </div>
  );
}
