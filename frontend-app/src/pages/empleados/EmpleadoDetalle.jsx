import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useEmpleadosStore } from "../../store/empleadosStore";
import { useSeguridadStore } from "../../store/seguridadStore";

import ResumenEmpleado from "./ResumenEmpleado";
import DatosPersonales from "./DatosPersonales";
import DatosLaborales from "./DatosLaborales";
import RolEmpleado from "./RolEmpleado";
import ModulosVisibles from "./ModulosVisibles";
import PermisosEmpleado from "./PermisosEmpleado";
import FotoEmpleado from "./FotoEmpleado";
import EstadoEmpleado from "./EstadoEmpleado";
import AuditoriaEmpleado from "./AuditoriaEmpleado";
import EditarEmpleado from "./EditarEmpleado";

const getFotoURL = (foto) => {
  if (!foto || foto === "string" || foto.trim() === "") {
    return "/placeholder.png";
  }
  if (foto.startsWith("http")) return foto;
  return `${import.meta.env.VITE_API_URL}${foto}`;
};

export default function EmpleadoDetalle() {
  const { empleadoId } = useParams();

  const {
    empleadoActual,
    cargarEmpleado,
  } = useEmpleadosStore();

  const { cargarRoles } = useSeguridadStore();

  const [tab, setTab] = useState("resumen");

  // Cargar empleado + roles SOLO una vez
  useEffect(() => {
    cargarEmpleado(empleadoId);
    cargarRoles();
  }, [empleadoId]);

  if (!empleadoActual) {
    return <div className="p-6">Cargando empleado...</div>;
  }

  const empleado = empleadoActual;

  return (
    <div className="p-6 space-y-6">

      {/* CABECERA */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={getFotoURL(empleado.foto)}
          alt="Foto empleado"
          className="w-20 h-20 rounded-full object-cover border"
        />

        <div>
          <h2 className="text-2xl font-bold">
            {empleado.nombre} {empleado.apellidos}
          </h2>

          <p className={empleado.activo ? "text-green-600" : "text-red-600"}>
            Estado: {empleado.activo ? "Activo" : "Inactivo"}
          </p>

          <p className="text-neutral-700 text-sm">
            Rol: {empleado.rol_nombre || "Sin rol"}
          </p>

          <p className="text-neutral-700 text-sm">
            Usuario: {empleado.usuario}
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
          ["modulos", "Módulos visibles"],
          ["permisos", "Permisos"],
          ["foto", "Foto"],
          ["estado", "Estado"],
          ["auditoria", "Auditoría"],
          ["editar", "Editar completo"],
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
      {tab === "datos" && <DatosPersonales empleadoId={empleadoId} />}
      {tab === "laboral" && <DatosLaborales empleadoId={empleadoId} />}
      {tab === "rol" && <RolEmpleado empleadoId={empleadoId} />}
      {tab === "modulos" && <ModulosVisibles empleadoId={empleadoId} />}
      {tab === "permisos" && <PermisosEmpleado empleadoId={empleadoId} />}
      {tab === "foto" && <FotoEmpleado empleadoId={empleadoId} />}
      {tab === "estado" && <EstadoEmpleado empleadoId={empleadoId} />}
      {tab === "auditoria" && <AuditoriaEmpleado empleadoId={empleadoId} />}
      {tab === "editar" && <EditarEmpleado empleadoId={empleadoId} />}
    </div>
  );
}
