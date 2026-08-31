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
    // Datos personales
    nombre: "",
    apellidos: "",
    dni: "",
    telefono: "",
    email_personal: "",
    direccion: "",
    fecha_nacimiento: "",
    alergias: "",
    persona_contacto: "",
    telefono_contacto: "",
    observaciones: "",

    // Datos laborales
    departamento_id: "",
    seccion_id: "",
    cargo_id: "",
    email_empresa: "",
    extension: "",
    fecha_alta: "",
    fecha_baja: "",

    // Rol y estado
    rol_id: "",
    activo: true,

    // Usuario
    usuario: "",
  });

  // Cargar empleado + roles + maestros
  useEffect(() => {
    cargarEmpleado(empleadoId);
    cargarRoles();

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

  // Rellenar formulario cuando llega el empleado
  useEffect(() => {
    if (empleadoActual) {
      setForm({
        nombre: empleadoActual.nombre || "",
        apellidos: empleadoActual.apellidos || "",
        dni: empleadoActual.dni || "",
        telefono: empleadoActual.telefono || "",
        email_personal: empleadoActual.email_personal || "",
        direccion: empleadoActual.direccion || "",
        fecha_nacimiento: empleadoActual.fecha_nacimiento || "",
        alergias: empleadoActual.alergias || "",
        persona_contacto: empleadoActual.persona_contacto || "",
        telefono_contacto: empleadoActual.telefono_contacto || "",
        observaciones: empleadoActual.observaciones || "",

        departamento_id: empleadoActual.departamento_id || "",
        seccion_id: empleadoActual.seccion_id || "",
        cargo_id: empleadoActual.cargo_id || "",
        email_empresa: empleadoActual.email_empresa || "",
        extension: empleadoActual.extension || "",
        fecha_alta: empleadoActual.fecha_alta || "",
        fecha_baja: empleadoActual.fecha_baja || "",

        rol_id: empleadoActual.rol_id || "",
        activo: Boolean(empleadoActual.activo),

        usuario: empleadoActual.usuario || "",
      });
    }
  }, [empleadoActual]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const guardar = async () => {
    const payload = {
      ...form,
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
        <div>
          <label className="font-semibold">Sección</label>
          <select
            value={form.seccion_id}
            onChange={(e) => handleChange("seccion_id", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Seleccionar sección</option>
            {secciones.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold">Departamento</label>
          <select
            value={form.departamento_id}
            onChange={(e) => handleChange("departamento_id", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Seleccionar departamento</option>
            {departamentos.map((d) => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold">Cargo</label>
          <select
            value={form.cargo_id}
            onChange={(e) => handleChange("cargo_id", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Seleccionar cargo</option>
            {cargos.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* DATOS PERSONALES */}
      <h3 className="text-lg font-semibold">Datos personales</h3>
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label>Nombre</label>
          <input className="input" value={form.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)} />
        </div>

        <div>
          <label>Apellidos</label>
          <input className="input" value={form.apellidos}
            onChange={(e) => handleChange("apellidos", e.target.value)} />
        </div>

        <div>
          <label>DNI</label>
          <input className="input" value={form.dni}
            onChange={(e) => handleChange("dni", e.target.value)} />
        </div>

        <div>
          <label>Teléfono</label>
          <input className="input" value={form.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)} />
        </div>

        <div>
          <label>Email personal</label>
          <input className="input" value={form.email_personal}
            onChange={(e) => handleChange("email_personal", e.target.value)} />
        </div>

        <div>
          <label>Dirección</label>
          <input className="input" value={form.direccion}
            onChange={(e) => handleChange("direccion", e.target.value)} />
        </div>

        <div>
          <label>Fecha nacimiento</label>
          <input type="date" className="input" value={form.fecha_nacimiento}
            onChange={(e) => handleChange("fecha_nacimiento", e.target.value)} />
        </div>

        <div>
          <label>Alergias</label>
          <input className="input" value={form.alergias}
            onChange={(e) => handleChange("alergias", e.target.value)} />
        </div>

        <div>
          <label>Persona contacto</label>
          <input className="input" value={form.persona_contacto}
            onChange={(e) => handleChange("persona_contacto", e.target.value)} />
        </div>

        <div>
          <label>Teléfono contacto</label>
          <input className="input" value={form.telefono_contacto}
            onChange={(e) => handleChange("telefono_contacto", e.target.value)} />
        </div>

        <div className="col-span-2">
          <label>Observaciones</label>
          <textarea className="input" value={form.observaciones}
            onChange={(e) => handleChange("observaciones", e.target.value)} />
        </div>

      </div>

      {/* DATOS LABORALES */}
      <h3 className="text-lg font-semibold mt-6">Datos laborales</h3>
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label>Extensión</label>
          <input className="input" value={form.extension}
            onChange={(e) => handleChange("extension", e.target.value)} />
        </div>

        <div>
          <label>Fecha alta</label>
          <input type="date" className="input" value={form.fecha_alta}
            onChange={(e) => handleChange("fecha_alta", e.target.value)} />
        </div>

        <div>
          <label>Fecha baja</label>
          <input type="date" className="input" value={form.fecha_baja}
            onChange={(e) => handleChange("fecha_baja", e.target.value)} />
        </div>

      </div>

      {/* ROL Y ESTADO */}
      <h3 className="text-lg font-semibold mt-6">Rol y estado</h3>
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label>Rol</label>
          <select
            className="input"
            value={form.rol_id}
            onChange={(e) => handleChange("rol_id", Number(e.target.value))}
          >
            <option value="">Seleccionar rol</option>
            {(roles || []).map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>

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
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar cambios
      </button>
    </div>
  );
}
