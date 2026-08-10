import React, { useEffect, useState } from "react";

export default function ModulosEmpleado({ empleadoId }) {
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);

  const modulosDisponibles = [
    "dashboard",
    "agenda",
    "empleados",
    "intranet",
    "documentos",
    "noticias",
    "mensajes",
    "ctn",
    "seguridad",
    "utilidades",
  ];

  const cargar = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/empleados/${empleadoId}/modulos`);
    const data = await res.json();
    setModulos(data.modulos_visibles || []);
    setLoading(false);
  };

  useEffect(() => {
    cargar();
  }, [empleadoId]);

  const toggleModulo = (modulo) => {
    if (modulos.includes(modulo)) {
      setModulos(modulos.filter((m) => m !== modulo));
    } else {
      setModulos([...modulos, modulo]);
    }
  };

  const guardar = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/empleados/${empleadoId}/modulos`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modulos),
    });
    alert("Módulos actualizados");
  };

  if (loading) return <p>Cargando módulos...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Módulos visibles</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modulosDisponibles.map((modulo) => (
          <label key={modulo} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={modulos.includes(modulo)}
              onChange={() => toggleModulo(modulo)}
              className="h-4 w-4"
            />
            <span className="text-sm">{modulo}</span>
          </label>
        ))}
      </div>

      <button
        onClick={guardar}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Guardar cambios
      </button>
    </div>
  );
}
