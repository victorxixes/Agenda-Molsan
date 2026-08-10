import React, { useEffect } from "react";
import { useInformesStore } from "../../store/informesStore";

export default function InformesApoderadosPage() {
  const { apoderados, loading, error, cargarApoderados } = useInformesStore();

  useEffect(() => {
    cargarApoderados();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Informe de apoderados</h1>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Nombre</th>
              <th className="border px-2 py-1">Total citas</th>
              <th className="border px-2 py-1">Finalizadas</th>
              <th className="border px-2 py-1">Canceladas</th>
            </tr>
          </thead>
          <tbody>
            {apoderados.map((a) => (
              <tr key={a.apoderado_id}>
                <td className="border px-2 py-1">{a.apoderado_id}</td>
                <td className="border px-2 py-1">{a.nombre}</td>
                <td className="border px-2 py-1">{a.total_citas}</td>
                <td className="border px-2 py-1">{a.finalizadas}</td>
                <td className="border px-2 py-1">{a.canceladas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
