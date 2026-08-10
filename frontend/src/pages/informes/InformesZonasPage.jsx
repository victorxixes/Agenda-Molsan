import React, { useEffect } from "react";
import { useInformesStore } from "../../store/informesStore";

export default function InformesZonasPage() {
  const { zonas, loading, error, cargarZonas } = useInformesStore();

  useEffect(() => {
    cargarZonas();
  }, []);

  const maxVisitas = zonas.length
    ? Math.max(...zonas.map((z) => z.total_visitas))
    : 0;

  const intensidad = (valor) => {
    if (maxVisitas === 0) return 0;
    return Math.round((valor / maxVisitas) * 100);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Mapa de calor de zonas</h1>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          {zonas.map((z) => (
            <div
              key={z.zona}
              className="border rounded p-3"
              style={{
                background: `rgba(255, 0, 0, ${intensidad(z.total_visitas) / 100})`,
              }}
            >
              <h2 className="font-semibold mb-2">{z.zona}</h2>
              <p>Visitas: {z.total_visitas}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
