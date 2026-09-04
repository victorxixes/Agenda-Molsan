import { Link } from "react-router-dom";

export default function Herramientas() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Herramientas</h1>

      <div className="grid grid-cols-3 gap-6">
        <Card titulo="Importar CTN" link="/herramientas/importar-ctn" />
        <Card titulo="Importar Apoderados" link="/herramientas/importar-apoderados" />
        <Card titulo="Utilidades del sistema" link="/herramientas/utilidades" />
      </div>
    </div>
  );
}

function Card({ titulo, link }) {
  return (
    <Link
      to={link}
      className="border rounded p-6 bg-white shadow hover:bg-gray-50 transition"
    >
      <h2 className="text-xl font-semibold">{titulo}</h2>
    </Link>
  );
}
