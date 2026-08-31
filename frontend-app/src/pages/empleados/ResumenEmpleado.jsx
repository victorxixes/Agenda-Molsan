import { useEffect, useState } from "react";
import { useEmpleadosStore } from "../../store/empleadosStore";
import { getFotoURL } from "../../helpers/getFotoURL";

export default function ResumenEmpleado({ empleadoId }) {
  const { empleadoActual, cargarEmpleado } = useEmpleadosStore();

  const [departamentos, setDepartamentos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [cargos, setCargos] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/maestros/departamentos`)
      .then((r) => r.json())
      .then(setDepartamentos);

    fetch(`${import.meta.env.VITE_API_URL}/maestros/secciones`)
      .then((r) => r.json())
      .then(setSecciones);

    fetch(`${import.meta.env.VITE_API_URL}/maestros/cargos`)
      .then((r) => r.json())
      .then(setCargos);
  }, [empleadoId]);

  if (!empleadoActual) return <div className="p-6">Cargando resumen...</div>;

  const e = empleadoActual;

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

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">Resumen del empleado</h2>

      {/* FOTO + NOMBRE */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={getFotoURL(e.foto)}
          alt="Foto empleado"
          className="w-20 h-20 rounded-full object-cover border"
        />

        <div>
          <p className="text-lg font-semibold">
            {e.nombre} {e.apellidos}
          </p>

          <p className="text-sm text-neutral-600">
            Usuario: {e.usuario}
          </p>

          <p className="text-sm text-neutral-600">
            Rol: {e.rol_nombre || "Sin rol"}
          </p>

          <p
            className={`text-sm ${
              e.activo ? "text-green-600" : "text-red-600"
            }`}
          >
            Estado: {e.activo ? "Activo" : "Inactivo"}
          </p>
        </div>
      </div>

      {/* GRID DE DATOS */}
      <div className="grid grid-cols-2 gap-4">

        {/* DATOS PERSONALES */}
        <div>
          <h3 className="font-semibold mb-2">Datos personales</h3>
          <p><strong>DNI:</strong> {e.dni || "—"}</p>
          <p><strong>Teléfono:</strong> {e.telefono || "—"}</p>
          <p><strong>Email personal:</strong> {e.email_personal || "—"}</p>
          <p><strong>Dirección:</strong> {e.direccion || "—"}</p>
        </div>

        {/* DATOS LABORALES */}
        <div>
          <h3 className="font-semibold mb-2">Datos laborales</h3>
          <p><strong>Sección:</strong> {getSeccionNombre(e.seccion_id)}</p>
          <p><strong>Departamento:</strong> {getDepartamentoNombre(e.departamento_id)}</p>
          <p><strong>Cargo:</strong> {getCargoNombre(e.cargo_id)}</p>
          <p><strong>Email empresa:</strong> {e.email_empresa || "—"}</p>
        </div>
      </div>
    </div>
  );
}
