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

  if (loading || !notaria)
    return <p className="text-white/70 p-6 animate-pulse">Cargando notaría…</p>;

  return (
    <div className="p-6 space-y-6 text-white">

      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h1 className="text-3xl font-bold drop-shadow">
          {notaria.nombre} {notaria.apellidos}
        </h1>
        <p className="text-white/70">Ficha completa de la notaría #{notaria.id}</p>
      </div>

      <div className="
        bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl
      ">
        <p><strong>Código:</strong> {notaria.codigo}</p>
        <p><strong>NIF:</strong> {notaria.nif}</p>
        <p><strong>Teléfono:</strong> {notaria.telefono}</p>
        <p><strong>Provincia:</strong> {notaria.provincia}</p>
        <p><strong>Municipio:</strong> {notaria.municipio}</p>
        <p><strong>CP:</strong> {notaria.cp}</p>
        <p><strong>Dirección:</strong> {notaria.direccion}</p>
        <p><strong>VC:</strong> {notaria.vc}</p>
        <p><strong>Apoderado:</strong> {notaria.apoderado}</p>
        <p><strong>Observación:</strong> {notaria.observacion}</p>
      </div>

      {firmas && (
        <div className="
          bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl
        ">
          <h2 className="text-xl font-semibold mb-2 drop-shadow">Firmas</h2>
          <p>Total: {firmas.total_firmas}</p>
          <p>VC: {firmas.total_vc}</p>
          <p>Presencial: {firmas.total_presencial}</p>
        </div>
      )}
    </div>
  );
}
