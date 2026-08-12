import { useState } from "react";

export default function BuscadorEmpleados({ onBuscar }) {
  const [id, setId] = useState("");
  const [dni, setDni] = useState("");
  const [q, setQ] = useState("");
  const [activo, setActivo] = useState("");

  const buscar = () => {
    onBuscar({
      id: id || null,
      dni: dni || null,
      q: q || "",
      activo: activo === "" ? null : activo === "true"
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-neutral-300 shadow-md mb-4 flex gap-4 items-end">

      <div className="flex flex-col">
        <label className="text-sm font-semibold text-neutral-800">ID</label>
        <input
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="input-premium"
          placeholder="Ej: 1"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-semibold text-neutral-800">DNI</label>
        <input
          type="text"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="input-premium"
          placeholder="Ej: 12345678A"
        />
      </div>

      <div className="flex flex-col flex-1">
        <label className="text-sm font-semibold text-neutral-800">Nombre / Apellidos</label>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="input-premium"
          placeholder="Ej: Víctor"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-semibold text-neutral-800">Estado</label>
        <select
          value={activo}
          onChange={(e) => setActivo(e.target.value)}
          className="input-premium"
        >
          <option value="">Todos</option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>

      <button
        onClick={buscar}
        className="btn-premium"
      >
        Buscar
      </button>
    </div>
  );
}
