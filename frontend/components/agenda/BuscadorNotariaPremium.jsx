import React, { useState } from "react";

export default function BuscadorNotariaPremium({ notarios, onSelect }) {
  const [buscar, setBuscar] = useState("");
  const [mostrarLista, setMostrarLista] = useState(false);

  const resultados =
    buscar.length > 1
      ? notarios.filter((n) =>
          `${n.nombre} ${n.apellidos}`
            .toLowerCase()
            .includes(buscar.toLowerCase())
        )
      : [];

  const seleccionar = (n) => {
    setBuscar(`${n.nombre} ${n.apellidos}`);
    setMostrarLista(false);
    onSelect(n);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="input w-full"
        placeholder="Buscar notaría..."
        value={buscar}
        onChange={(e) => {
          setBuscar(e.target.value);
          setMostrarLista(true);
        }}
      />

      {mostrarLista && resultados.length > 0 && (
        <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
          {resultados.map((n) => (
            <div
              key={n.id}
              className="p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => seleccionar(n)}
            >
              <div className="font-semibold text-gray-800">
                {n.nombre} {n.apellidos}
              </div>

              <div className="text-sm text-gray-600">
                {n.municipio} ({n.provincia})
              </div>

              <div className="text-xs text-gray-500">
                Código: {n.codigo} — NIF: {n.nif}
              </div>

              {n.vc && (
                <div className="text-xs text-blue-600 mt-1">
                  Firma: {n.vc}
                </div>
              )}

              {n.apoderado && (
                <div className="text-xs text-green-600">
                  Apoderado: {n.apoderado}
                </div>
              )}

              {n.apoderado_s && (
                <div className="text-xs text-green-600">
                  Apoderado suplente: {n.apoderado_s}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {mostrarLista && resultados.length === 0 && buscar.length > 1 && (
        <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow p-3 text-gray-500">
          No se encontraron notarías.
        </div>
      )}
    </div>
  );
}
