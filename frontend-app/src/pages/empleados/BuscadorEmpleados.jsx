import { useState } from "react";

export default function BuscadorEmpleados({ onBuscar }) {
  const [id, setId] = useState("");
  const [dni, setDni] = useState("");
  const [q, setQ] = useState("");

  const buscar = () => {
    onBuscar({
      id: id || null,
      dni: dni || null,
      q: q || "",
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex gap-4 items-end">

      <div className="flex flex-col">
        <label className="text-sm font-semibold text-[#1F3A5F]">ID</label>
        <input
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="input border rounded px-2 py-1"
          placeholder="Ej: 1"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-semibold text-[#1F3A5F]">DNI</label>
        <input
          type="text"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="input border rounded px-2 py-1"
          placeholder="Ej: 12345678A"
        />
      </div>

      <div className="flex flex-col flex-1">
        <label className="text-sm font-semibold text-[#1F3A5F]">Nombre / Apellidos</label>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="input border rounded px-2 py-1"
          placeholder="Ej: Víctor"
        />
      </div>

      <button
        onClick={buscar}
        className="btn-primary px-4 py-2 rounded bg-[#1F3A5F] text-white"
      >
        Buscar
      </button>
    </div>
  );
}
