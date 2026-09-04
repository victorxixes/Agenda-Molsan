import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCtn } from "../../hooks/useCtn";

export default function CtnDetallePage() {
  const { id } = useParams();
  const { notaria, cargarNotaria, loading } = useCtn();

  useEffect(() => {
    cargarNotaria(id);
  }, [id]);

  if (loading || !notaria) return <p>Cargando notaría…</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{notaria.nombre}</h1>

      <div className="border p-4 rounded bg-white shadow">
        <p><strong>Dirección:</strong> {notaria.direccion}</p>
        <p><strong>Localidad:</strong> {notaria.localidad}</p>
        <p><strong>Teléfono:</strong> {notaria.telefono || "—"}</p>
        <p><strong>Email:</strong> {notaria.email || "—"}</p>
      </div>

      {notaria.lat && notaria.lng && (
        <iframe
          title="mapa"
          width="100%"
          height="300"
          className="rounded border"
          src={`https://maps.google.com/maps?q=${notaria.lat},${notaria.lng}&z=15&output=embed`}
        />
      )}
    </div>
  );
}
