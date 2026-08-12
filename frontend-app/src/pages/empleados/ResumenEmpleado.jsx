import { useEffect, useState } from "react";
import axios from "axios";

export default function ResumenEmpleado({
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
      <h2 className="text-xl font-bold mb-4">Resumen del empleado</h2>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
        <div>
          <div className="text-lg font-semibold">
            {empleado.nombre} {empleado.apellidos}
          </div>
          <div className="text-sm text-green-600">
            Estado: {empleado.activo ? "Activo" : "Inactivo"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Datos personales</h3>
          <p>DNI: {empleado.dni}</p>
          <p>Teléfono: {empleado.telefono}</p>
          <p>Email personal: {empleado.email_personal}</p>
          <p>Dirección: {empleado.direccion}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Datos laborales</h3>

          {/* 🔥 Mostrar nombres reales */}
          <p>Sección: {getSeccionNombre(empleado.seccion_id)}</p>
          <p>Departamento: {getDepartamentoNombre(empleado.departamento_id)}</p>
          <p>Cargo: {getCargoNombre(empleado.cargo_id)}</p>

          {/* 🔥 Resto de datos */}
          <p>Email empresa: {empleado.email_empresa}</p>
        </div>
      </div>
    </div>
  );
}
