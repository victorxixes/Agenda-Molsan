import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

import ResumenEmpleado from "./ResumenEmpleado";
import RolEmpleado from "./RolEmpleado";
import ModulosVisibles from "./ModulosVisibles";
import PermisosEmpleado from "./PermisosEmpleado";
import AuditoriaEmpleado from "./AuditoriaEmpleado";
import DatosPersonales from "./DatosPersonales";
import DatosLaborales from "./DatosLaborales";
import EditarEmpleado from "./EditarEmpleado";
import FotoEmpleado from "./FotoEmpleado";
import EstadoEmpleado from "./EstadoEmpleado";

export default function EmpleadoDetalle() {
  const { empleadoId } = useParams();
  const [empleado, setEmpleado] = useState(null);
  const [tab, setTab] = useState("resumen");

  const [departamentos, setDepartamentos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [cargos, setCargos] = useState([]);

  // Limpieza de valores corruptos
  const limpiar = (obj) => {
    const limpio = { ...obj };
    for (const key in limpio) {
      if (
        limpio[key] === "string" ||
        limpio[key] === null ||
        limpio[key] === "null" ||
        limpio[key] === undefined
      ) {
        limpio[key] = "";
      }
    }
    return limpio;
  };

  // Foto correcta
  const getFotoURL = (foto) => {
    if (!foto || foto === "string" || foto.trim() === "") {
      return "/placeholder.png";
    }
    return `${import.meta.env.VITE_API_URL}${foto}`;
  };

  // Cargar empleado
  useEffect(() => {
    axios.get(`/empleados/${empleadoId}`).then((res) => {
      setEmpleado(limpiar(res.data));
    });
  }, [empleadoId]);

  // Cargar listas
  useEffect(() => {
    axios.get(`/empleados/departamentos`).then((r) => setDepartamentos(r.data));
    axios.get(`/empleados/secciones`).then((r) => setSecciones(r.data));
    axios.get(`/empleados/cargos`).then((r) => setCargos(r.data));
  }, []);

  // Convertir IDs → nombres
  const getDepartamentoNombre = (id) => {
    const d = departamentos.find((dep) => dep.id === Number(id));
    return d ? d.nombre : "Sin departamento";
  };

  const getSeccionNombre = (id) => {
    const s = secciones.find((sec) => sec.id === Number(id));
    return s ? s.nombre : "Sin sección";
  };

  const getCargoNombre = (id) => {
    const c = cargos.find((cg) => cg.id === Number(id));
    return c ? c.nombre : "Sin cargo";
  };

  if (!empleado) return <div className="p-6">Cargando empleado...</div>;

  return (
    <div className="p-6">
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
            Sección: {getSeccionNombre(empleado.seccion_id)}
          </p>
          <p className="text-neutral-700 text-sm">
            Departamento: {getDepartamentoNombre(empleado.departamento_id)}
          </p>
          <p className="text-neutral-700 text-sm">
            Cargo: {getCargoNombre(empleado.cargo_id)}
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
      {tab === "resumen" && (
        <ResumenEmpleado
          empleadoId={empleadoId}
          getSeccionNombre={getSeccionNombre}
          getDepartamentoNombre={getDepartamentoNombre}
          getCargoNombre={getCargoNombre}
        />
      )}

      {tab === "datos" && (
        <DatosPersonales
          empleadoId={empleadoId}
          getSeccionNombre={getSeccionNombre}
          getDepartamentoNombre={getDepartamentoNombre}
          getCargoNombre={getCargoNombre}
        />
      )}

      {tab === "laboral" && (
        <DatosLaborales
          empleadoId={empleadoId}
          getSeccionNombre={getSeccionNombre}
          getDepartamentoNombre={getDepartamentoNombre}
          getCargoNombre={getCargoNombre}
        />
      )}

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
