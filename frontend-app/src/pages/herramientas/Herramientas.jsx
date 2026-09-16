import { Link } from "react-router-dom";

export default function Herramientas() {
  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold text-white drop-shadow">
        Herramientas
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card titulo="Importar CTN" link="/herramientas/importar-ctn" />
      </div>

    </div>
  );
}

function Card({ titulo, link }) {
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
    </Link>
  );
}
