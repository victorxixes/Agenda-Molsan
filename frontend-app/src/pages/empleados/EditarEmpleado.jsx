import { useEffect, useState } from "react";
import { useEmpleadosStore } from "../../store/empleadosStore";
import { useSeguridadStore } from "../../store/seguridadStore";

export default function EditarEmpleado({ empleadoId }) {
  const {
    empleadoActual,
    cargarEmpleado,
    actualizarEmpleado,
  } = useEmpleadosStore();

  const {
    roles,
    cargarRoles,
  } = useSeguridadStore();

  const [departamentos, setDepartamentos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [cargos, setCargos] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    usuario: "",
    email_empresa: "",
    rol_id: "",
    activo: true,
    departamento_id: "",
    seccion_id: "",
    cargo_id: "",
  });

  // Cargar empleado + roles + maestros
  useEffect(() => {
    cargarEmpleado(empleadoId);
    cargarRoles();

    // Maestros (secciones, departamentos, cargos)
    fetch(`${import.meta.env.VITE_API_URL}/empleados/departamentos`)
      .then((r) => r.json())
      .then(setDepartamentos);

    fetch(`${import.meta.env.VITE_API_URL}/empleados/secciones`)
      .then((r) => r.json())
      .then(setSecciones);

    fetch(`${import.meta.env.VITE_API_URL}/empleados/cargos`)
      .then((r) => r.json())
      .then(setCargos);
  }, [empleadoId]);

  // Cuando llega el empleado del store → rellenamos formulario
  useEffect(() => {
    if (empleadoActual) {
      setForm({
        nombre: empleadoActual.nombre || "",
        apellidos: empleadoActual.apellidos || "",
        usuario: empleadoActual.usuario || "",
        email_empresa: empleadoActual.email_empresa || "",
        rol_id: empleadoActual.rol_id || "",
        activo: Boolean(empleadoActual.activo),
        departamento_id: empleadoActual.departamento_id || "",
        seccion_id: empleadoActual.seccion_id || "",
        cargo_id: empleadoActual.cargo_id || "",
      });
    }
  }, [empleadoActual]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const guardar = async () => {
    const payload = {
      nombre: form.nombre,
      apellidos: form.apellidos,
      usuario: form.usuario,
      email_empresa: form.email_empresa,
      rol_id: Number(form.rol_id) || null,
      activo: Boolean(form.activo),
      departamento_id: Number(form.departamento_id) || null,
      seccion_id: Number(form.seccion_id) || null,
      cargo_id: Number(form.cargo_id) || null,
    };

    await actualizarEmpleado(empleadoId, payload);
    alert("Empleado actualizado correctamente");
  };

  if (!empleadoActual) return <div className="p-6">Cargando empleado...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">Editar empleado</h2>

      {/* SECCIÓN / DEPARTAMENTO / CARGO */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* SECCIÓN */}
        <div>
          <label className="font-semibold">Sección</label>
          <select
            value={form.seccion_id}
            onChange={(e) => handleChange("seccion_id", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Seleccionar sección</option>
            {secciones.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* DEPARTAMENTO */}
        <div>
          <label className="font-semibold">Departamento</label>
          <select
            value={form.departamento_id}
            onChange={(e) => handleChange("departamento_id", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Seleccionar departamento</option>
            {departamentos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* CARGO */}
        <div>
          <label className="font-semibold">Cargo</label>
          <select
            value={form.cargo_id}
            onChange={(e) => handleChange("cargo_id", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Seleccionar cargo</option>
            {cargos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CAMPOS GENERALES */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-semibold">Nombre</label>
          <input
            className="border rounded px-2 py-1 w-full"
            value={form.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold">Apellidos</label>
          <input
            className="border rounded px-2 py-1 w-full"
            value={form.apellidos}
            onChange={(e) => handleChange("apellidos", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold">Usuario</label>
          <input
            className="border rounded px-2 py-1 w-full"
            value={form.usuario}
            onChange={(e) => handleChange("usuario", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold">Email empresa</label>
          <input
            className="border rounded px-2 py-1 w-full"
            value={form.email_empresa}
            onChange={(e) => handleChange("email_empresa", e.target.value)}
          />
        </div>

        {/* ROL */}
        <div>
          <label className="font-semibold">Rol</label>
          <select
            value={form.rol_id}
            onChange={(e) => handleChange("rol_id", Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Seleccionar rol</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* ACTIVO */}
        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            checked={form.activo}
            onChange={(e) => handleChange("activo", e.target.checked)}
          />
          <label className="font-semibold">Activo</label>
        </div>
      </div>

      <button
        onClick={guardar}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar cambios
      </button>
    </div>
  );
}
