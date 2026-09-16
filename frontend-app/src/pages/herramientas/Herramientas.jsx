import { useCallback } from "react";
import { Link } from "react-router-dom";

/**
 * Herramientas — SJ‑2026 Premium
 * - Cards glass‑UI
 * - Animación fade‑in
 */

export default function Herramientas() {
  const titulo = useCallback(() => "Herramientas", []);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white drop-shadow">
        {titulo()}
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
        p-6 shadow-xl hover:bg-white/20 transition block active:scale-[0.97]
      "
    >
      <h2 className="text-xl font-semibold text-white drop-shadow mb-2">
        {titulo}
      </h2>
    </Link>
  );
}
