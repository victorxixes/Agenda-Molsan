import React, { useEffect, useState } from "react";

export default function PermisosEmpleado({ empleadoId }) {
  const [permisos, setPermisos] = useState({});
  const [loading, setLoading] = useState(true);

  const accionesDisponibles = ["ver", "editar", "borrar"];

  const cargar = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/empleados/${empleadoId}/modulos`);
    const data = await res.json();
    setPermisos(data.permisos_modulo || {});
    setLoading(false);
  };

  useEffect(() => {
    cargar();
  }, [empleadoId]);

  const togglePermiso = (modulo, accion) => {
    const actuales = permisos[modulo] || [];

    if (actuales.includes(accion)) {
      setPermisos({
        ...permisos,
        [modulo]: actuales.filter((a) => a !== accion),
      });
    } else {
      setPermisos({
        ...permisos,
        [modulo]: [...actuales, accion],
      });
    }
  };

  const guardar = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/empleados/${empleadoId}/permisos`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(permisos),
    });
    alert("Permisos actualizados");
  };

  if (loading) return <p>Cargando permisos...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Permisos por módulo</h2>

      {Object.keys(permisos).map((modulo) => (
        <div key={modulo} className="border p-3 rounded">
          <h3 className="font-semibold mb-2">{modulo}</h3>

          <div className="flex gap-4">
            {accionesDisponibles.map((accion) => (
              <label key={accion} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permisos[modulo]?.includes(accion)}
                  onChange={() => togglePermiso(modulo, accion)}
                />
                {accion}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={guardar}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Guardar cambios
      </button>
    </div>
  );
}
