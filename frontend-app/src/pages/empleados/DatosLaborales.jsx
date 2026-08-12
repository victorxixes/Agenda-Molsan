import { useEffect, useState } from "react";
import axios from "axios";

export default function DatosLaborales({
  empleadoId,
  getSeccionNombre,
  getDepartamentoNombre,
  getCargoNombre,
}) {
  const [empleado, setEmpleado] = useState(null);
  const API = "https://agenda-intranet-b.onrender.com";

  useEffect(() => {
    axios.get(`${API}/empleados/${empleadoId}`).then((res) => {
      setEmpleado(res.data);
    });
  }, [empleadoId]);

  if (!empleado) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Datos laborales</h2>

      <div className="grid grid-cols-2 gap-4">

        {/* 🔥 Mostrar nombres reales */}
        <div>
          <label className="font-semibold">Sección</label>
          <p>{getSeccionNombre(empleado.seccion_id)}</p>
        </div>

        <div>
          <label className="font-semibold">Departamento</label>
          <p>{getDepartamentoNombre(empleado.departamento_id)}</p>
        </div>

        <div>
          <label className="font-semibold">Cargo</label>
          <p>{getCargoNombre(empleado.cargo_id)}</p>
        </div>

        {/* 🔥 Resto de datos */}
        <div>
          <label className="font-semibold">Email empresa</label>
          <p>{empleado.email_empresa}</p>
        </div>

        <div>
          <label className="font-semibold">Extensión</label>
          <p>{empleado.extension}</p>
        </div>

        <div>
          <label className="font-semibold">Fecha alta</label>
          <p>{empleado.fecha_alta}</p>
        </div>

        <div>
          <label className="font-semibold">Fecha baja</label>
          <p>{empleado.fecha_baja}</p>
        </div>
      </div>
    </div>
  );
}
