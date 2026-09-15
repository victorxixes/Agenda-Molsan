import { useEffect, useState } from "react";
import { obtenerFichaCompleta } from "../api/empleados";
import { API_BASE } from "../api/config";

export default function EmpleadoPerfil({ id }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;

    obtenerFichaCompleta(id).then((res) => {
      setData(res.data);
    });
  }, [id]);

  if (!data) {
    return <div className="text-gray-500">Cargando perfil...</div>;
  }

  const empleado = data.empleado;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">
        Ficha empleado {empleado.id} — {empleado.nombre} {empleado.apellidos}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-semibold">Estado:</label>
          <div>{empleado.estado}</div>
        </div>

        <div>
          <label className="font-semibold">Teléfono:</label>
          <div>{empleado.telefono}</div>
        </div>

        <div>
          <label className="font-semibold">Email empresa:</label>
          <div>{empleado.email_empresa}</div>
        </div>

        <div>
          <label className="font-semibold">Extensión:</label>
          <div>{empleado.extension}</div>
        </div>
      </div>

      {/* Foto */}
      {empleado.foto && (
        <img
          src={`${API_BASE}${empleado.foto}`}
          alt="Foto empleado"
          className="w-32 h-32 rounded-lg object-cover border"
        />
      )}
    </div>
  );
}

