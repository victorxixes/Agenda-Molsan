import { useEffect, useState } from "react";
import { useEmpleadosStore } from "../../store/empleadosStore";

export default function DatosLaborales({ empleadoId }) {
  const { empleadoActual, cargarEmpleado } = useEmpleadosStore();

  const [departamentos, setDepartamentos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [cargos, setCargos] = useState([]);

  // Cargar empleado + maestros
  useEffect(() => {
    cargarEmpleado(empleadoId);

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

  if (!empleadoActual) return <div className="p-6">Cargando datos laborales...</div>;

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
      <h2 className="text-xl font-bold mb-4">Datos laborales</h2>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="font-semibold">Sección</label>
          <p>{getSeccionNombre(e.seccion_id)}</p>
        </div>

        <div>
          <label className="font-semibold">Departamento</label>
          <p>{getDepartamentoNombre(e.departamento_id)}</p>
        </div>

        <div>
          <label className="font-semibold">Cargo</label>
          <p>{getCargoNombre(e.cargo_id)}</p>
        </div>

        <div>
          <label className="font-semibold">Email empresa</label>
          <p>{e.email_empresa || "—"}</p>
        </div>

        <div>
          <label className="font-semibold">Extensión</label>
          <p>{e.extension || "—"}</p>
        </div>

        <div>
          <label className="font-semibold">Fecha alta</label>
          <p>{e.fecha_alta || "—"}</p>
        </div>

        <div>
          <label className="font-semibold">Fecha baja</label>
          <p>{e.fecha_baja || "—"}</p>
        </div>
      </div>
    </div>
  );
}
