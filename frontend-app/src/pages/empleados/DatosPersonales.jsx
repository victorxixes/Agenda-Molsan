import { useEffect, useState } from "react";
import axios from "axios";

export default function DatosPersonales({
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
      <h2 className="text-xl font-bold mb-4">Datos personales</h2>

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
          <label className="font-semibold">Nombre</label>
          <p>{empleado.nombre}</p>
        </div>

        <div>
          <label className="font-semibold">Apellidos</label>
          <p>{empleado.apellidos}</p>
        </div>

        <div>
          <label className="font-semibold">DNI</label>
          <p>{empleado.dni}</p>
        </div>

        <div>
          <label className="font-semibold">Teléfono</label>
          <p>{empleado.telefono}</p>
        </div>

        <div>
          <label className="font-semibold">Email personal</label>
          <p>{empleado.email_personal}</p>
        </div>

        <div>
          <label className="font-semibold">Dirección</label>
          <p>{empleado.direccion}</p>
        </div>

        <div>
          <label className="font-semibold">Fecha nacimiento</label>
          <p>{empleado.fecha_nacimiento}</p>
        </div>

        <div>
          <label className="font-semibold">Alergias</label>
          <p>{empleado.alergias}</p>
        </div>

        <div>
          <label className="font-semibold">Persona contacto</label>
          <p>{empleado.persona_contacto}</p>
        </div>

        <div>
          <label className="font-semibold">Teléfono contacto</label>
          <p>{empleado.telefono_contacto}</p>
        </div>

        <div className="col-span-2">
          <label className="font-semibold">Observaciones</label>
          <p>{empleado.observaciones}</p>
        </div>
      </div>
    </div>
  );
}
