import { useEffect, useState } from "react";
import axios from "axios";

export default function DatosLaborales({ empleadoId }) {
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
        <div>
          <label className="font-semibold">Departamento ID</label>
          <p>{empleado.departamento_id}</p>
        </div>

        <div>
          <label className="font-semibold">Sección ID</label>
          <p>{empleado.seccion_id}</p>
        </div>

        <div>
          <label className="font-semibold">Cargo ID</label>
          <p>{empleado.cargo_id}</p>
        </div>

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
