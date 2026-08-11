import { useEffect, useState } from "react";
import axios from "axios";

import ResumenEmpleado from "./ResumenEmpleado";
import RolEmpleado from "./RolEmpleado";
import ModulosVisibles from "./ModulosVisibles";
import PermisosEmpleado from "./PermisosEmpleado";
import AuditoriaEmpleado from "./AuditoriaEmpleado";
import DatosPersonales from "./DatosPersonales";
import DatosLaborales from "./DatosLaborales";
import EditarEmpleado from "./EditarEmpleado";
import FotoEmpleado from "./FotoEmpleado";
import AuditoriaEmpleado from "./AuditoriaEmpleado";


export default function EmpleadoDetalle() {
  const [empleado, setEmpleado] = useState(null);
  const [tab, setTab] = useState("resumen");

  const API = "https://agenda-intranet-backend.onrender.com";

  // Obtener ID desde la URL
  const empleadoId = window.location.pathname.split("/").pop();

  useEffect(() => {
    axios.get(`${API}/empleados/${empleadoId}`).then((res) => {
      setEmpleado(res.data);
    });
  }, [empleadoId]);

  if (!empleado) return <div className="p-6">Cargando empleado...</div>;

  return (
    <div className="p-6">
      {/* CABECERA */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full" />
        <div>
          <h2 className="text-2xl font-bold">
            {empleado.nombre} {empleado.apellidos}
          </h2>
          <p className="text-green-600">
            Estado: {empleado.activo ? "Activo" : "Inactivo"}
          </p>
        </div>
      </div>

      {/* PESTAÑAS */}
      <div className="flex gap-6 border-b mb-6 pb-2">
        {[
          ["resumen", "Resumen"],
          ["datos", "Datos personales"],
          ["laboral", "Datos laborales"],
          ["rol", "Rol"],
          ["modulos", "Módulos"],
          ["permisos", "Permisos"],
          ["auditoria", "Auditoría"],
          ["editar", "Editar completo"],
      ["foto", "Foto"],
["auditoria", "Auditoría"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`pb-2 ${
              tab === key ? "border-b-2 border-blue-600 font-semibold" : ""
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* CONTENIDO SEGÚN PESTAÑA */}
      {tab === "resumen" && <ResumenEmpleado empleadoId={empleadoId} />}
      {tab === "rol" && <RolEmpleado empleadoId={empleadoId} />}
      {tab === "modulos" && <ModulosVisibles empleadoId={empleadoId} />}
      {tab === "permisos" && <PermisosEmpleado empleadoId={empleadoId} />}
      {tab === "auditoria" && <AuditoriaEmpleado empleadoId={empleadoId} />}
      {tab === "datos" && <DatosPersonales empleadoId={empleadoId} />}
{tab === "laboral" && <DatosLaborales empleadoId={empleadoId} />}
{tab === "editar" && <EditarEmpleado empleadoId={empleadoId} />}
{tab === "foto" && <FotoEmpleado empleadoId={empleadoId} />}
{tab === "auditoria" && <AuditoriaEmpleado empleadoId={empleadoId} />}

      {/* Las pestañas "datos", "laboral" y "editar" las conectas cuando quieras */}
    </div>
  );
}
