import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCtn } from "../../hooks/useCtn";

export default function CtnDetallePage() {
  const { id } = useParams();
  const { notaria, firmas, cargarNotaria, cargarFirmasNotaria, loading } = useCtn();

  useEffect(() => {
    cargarNotaria(id);
    cargarFirmasNotaria(id);
  }, [id]);

  if (loading || !notaria) return <p>Cargando notaría…</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        {notaria.nombre} {notaria.apellidos}
      </h1>

      <div className="border p-4 rounded bg-white shadow">
        <p><strong>Código:</strong> {notaria.codigo}</p>
        <p><strong>NIF:</strong> {notaria.nif}</p>
        <p><strong>Teléfono:</strong> {notaria.telefono}</p>
        <p><strong>Provincia:</strong> {notaria.provincia}</p>
        <p><strong>Municipio:</strong> {notaria.municipio}</p>
        <p><strong>VC:</strong> {notaria.vc}</p>
        <p><strong>Apoderado:</strong> {notaria.apoderado}</p>
        <p><strong>Observación:</strong> {notaria.observacion}</p>
      </div>

      {firmas && (
        <div className="border p-4 rounded bg-white shadow">
          <h2 className="text-xl font-semibold mb-2">Firmas</h2>
          <p>Total: {firmas.total_firmas}</p>
          <p>VC: {firmas.total_vc}</p>
          <p>Presencial: {firmas.total_presencial}</p>
        </div>
      )}
    </div>
  );
}
