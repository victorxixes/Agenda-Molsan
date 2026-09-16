import { useEffect, useState } from "react";
import { API_BASE } from "../../api/config";
import {
  obtenerFichaCompleta,
  editarEmpleado,
  subirFotoEmpleado,
} from "../../api/empleados";

export default function EmpleadoPerfil({ id }) {
  const [data, setData] = useState(null);
  const [empleadoEdit, setEmpleadoEdit] = useState({});
  const [fotoPreview, setFotoPreview] = useState(null);

  const [tab, setTab] = useState("basicos");

  useEffect(() => {
    if (!id) return;
    obtenerFichaCompleta(id).then((res) => {
      setData(res.data);
      setEmpleadoEdit(res.data.empleado);
    });
  }, [id]);

  if (!data) return <div>Cargando perfil...</div>;

  const empleado = empleadoEdit;

  const handleChange = (field, value) => {
    setEmpleadoEdit((prev) => ({ ...prev, [field]: value }));
  };

  const guardarCambios = async () => {
    try {
      await editarEmpleado(empleado.id, empleadoEdit);
      alert("Cambios guardados correctamente");

      const res = await obtenerFichaCompleta(empleado.id);
      setData(res.data);
      setEmpleadoEdit(res.data.empleado);
    } catch (err) {
      console.error(err);
      alert("Error al guardar los cambios");
    }
  };

  const handleFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFotoPreview(URL.createObjectURL(file));

    await subirFotoEmpleado(empleado.id, file);
    const res = await obtenerFichaCompleta(empleado.id);
    setData(res.data);
    setEmpleadoEdit(res.data.empleado);
  };

  return (
    <div className="space-y-6">

      {/* TABS */}
      <div className="flex gap-4 border-b pb-2">
        <button
          className={tab === "basicos" ? "font-bold text-blue-600" : ""}
          onClick={() => setTab("basicos")}
        >
          Datos básicos
        </button>

        <button
          className={tab === "personales" ? "font-bold text-blue-600" : ""}
          onClick={() => setTab("personales")}
        >
          Datos personales
        </button>

        <button
          className={tab === "laborales" ? "font-bold text-blue-600" : ""}
          onClick={() => setTab("laborales")}
        >
          Datos laborales
        </button>

        <button
          className={tab === "seguridad" ? "font-bold text-blue-600" : ""}
          onClick={() => setTab("seguridad")}
        >
          Seguridad
        </button>

        <button
          className={tab === "auditoria" ? "font-bold text-blue-600" : ""}
          onClick={() => setTab("auditoria")}
        >
          Auditoría
        </button>
      </div>

      {/* ============================
          DATOS BÁSICOS (EDITABLE)
      ============================ */}
      {tab === "basicos" && (
        <section className="border p-4 rounded bg-white shadow">
          <h2 className="text-lg font-semibold mb-3">Datos básicos</h2>

          <div className="grid grid-cols-2 gap-2 text-sm">

            <div>
              <strong>Nombre:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.nombre || ""}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
            </div>

            <div>
              <strong>Apellidos:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.apellidos || ""}
                onChange={(e) => handleChange("apellidos", e.target.value)}
              />
            </div>

            <div>
              <strong>DNI:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.dni || ""}
                onChange={(e) => handleChange("dni", e.target.value)}
              />
            </div>

            <div>
              <strong>Teléfono:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.telefono || ""}
                onChange={(e) => handleChange("telefono", e.target.value)}
              />
            </div>

            <div>
              <strong>Email personal:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.email_personal || ""}
                onChange={(e) => handleChange("email_personal", e.target.value)}
              />
            </div>

            <div>
              <strong>Email empresa:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.email_empresa || ""}
                onChange={(e) => handleChange("email_empresa", e.target.value)}
              />
            </div>

            <div>
              <strong>Usuario:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.usuario || ""}
                onChange={(e) => handleChange("usuario", e.target.value)}
              />
            </div>

            <div>
              <strong>Rol actual:</strong>
              <div>{empleado.rol?.nombre || "—"}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            {(fotoPreview || empleado.foto) && (
              <img
                src={fotoPreview || `${API_BASE}${empleado.foto}`}
                alt="Foto empleado"
                className="w-24 h-24 rounded object-cover border"
              />
            )}

            <label className="text-sm">
              Subir nueva foto:
              <input type="file" className="block mt-1" onChange={handleFoto} />
            </label>
          </div>

          <button
            className="mt-4 px-3 py-1 bg-blue-600 text-white rounded text-sm"
            onClick={guardarCambios}
          >
            Guardar cambios
          </button>
        </section>
      )}

      {/* ============================
          DATOS PERSONALES (EDITABLE)
      ============================ */}
      {tab === "personales" && (
        <section className="border p-4 rounded bg-white shadow">
          <h2 className="text-lg font-semibold mb-3">Datos personales</h2>

          <div className="grid grid-cols-2 gap-2 text-sm">

            <div>
              <strong>Dirección:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.direccion || ""}
                onChange={(e) => handleChange("direccion", e.target.value)}
              />
            </div>

            <div>
              <strong>Código postal:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.codigo_postal || ""}
                onChange={(e) => handleChange("codigo_postal", e.target.value)}
              />
            </div>

            <div>
              <strong>Población:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.poblacion || ""}
                onChange={(e) => handleChange("poblacion", e.target.value)}
              />
            </div>

            <div>
              <strong>Provincia:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.provincia || ""}
                onChange={(e) => handleChange("provincia", e.target.value)}
              />
            </div>

            <div>
              <strong>Fecha nacimiento:</strong>
              <input
                type="date"
                className="border rounded p-1 w-full"
                value={empleado.fecha_nacimiento || ""}
                onChange={(e) => handleChange("fecha_nacimiento", e.target.value)}
              />
            </div>

            <div>
              <strong>Alergias:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.alergias || ""}
                onChange={(e) => handleChange("alergias", e.target.value)}
              />
            </div>

            <div>
              <strong>Persona contacto:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.persona_contacto || ""}
                onChange={(e) => handleChange("persona_contacto", e.target.value)}
              />
            </div>

            <div>
              <strong>Teléfono contacto:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.telefono_contacto || ""}
                onChange={(e) => handleChange("telefono_contacto", e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <strong>Observaciones:</strong>
              <textarea
                className="border rounded p-1 w-full"
                rows={3}
                value={empleado.observaciones || ""}
                onChange={(e) => handleChange("observaciones", e.target.value)}
              />
            </div>
          </div>

          <button
            className="mt-4 px-3 py-1 bg-blue-600 text-white rounded text-sm"
            onClick={guardarCambios}
          >
            Guardar cambios
          </button>
        </section>
      )}

      {/* ============================
          DATOS LABORALES (EDITABLE)
      ============================ */}
      {tab === "laborales" && (
        <section className="border p-4 rounded bg-white shadow">
          <h2 className="text-lg font-semibold mb-3">Datos laborales</h2>

          <div className="grid grid-cols-2 gap-2 text-sm">

            <div>
              <strong>Departamento ID:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.departamento_id || ""}
                onChange={(e) => handleChange("departamento_id", e.target.value)}
              />
            </div>

            <div>
              <strong>Sección ID:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.seccion_id || ""}
                onChange={(e) => handleChange("seccion_id", e.target.value)}
              />
            </div>

            <div>
              <strong>Cargo ID:</strong>
              <input
                className="border rounded p-1 w-full"
                value={empleado.cargo_id || ""}
                onChange={(e) => handleChange("cargo_id", e.target.value)}
              />
            </div>

            <div>
              <strong>Fecha alta:</strong>
              <input
                type="date"
                className="border rounded p-1 w-full"
                value={empleado.fecha_alta || ""}
                onChange={(e) => handleChange("fecha_alta", e.target.value)}
              />
            </div>

            <div>
              <strong>Fecha baja:</strong>
              <input
                type="date"
                className="border rounded p-1 w-full"
                value={empleado.fecha_baja || ""}
                onChange={(e) => handleChange("fecha_baja", e.target.value)}
              />
            </div>

            <div>
              <strong>Activo:</strong>
              <div>{empleado.activo ? "Sí" : "No"}</div>
            </div>
          </div>

          <button
            className="mt-4 px-3 py-1 bg-blue-600 text-white rounded text-sm"
            onClick={guardarCambios}
          >
            Guardar cambios
          </button>
        </section>
      )}

      {/* ============================
          SEGURIDAD (SOLO LECTURA)
      ============================ */}
      {tab === "seguridad" && (
        <section className="border p-4 rounded bg-white shadow">
          <h2 className="text-lg font-semibold mb-3">Seguridad</h2>

          <div className="text-sm">
            <strong>Módulos visibles:</strong>
            <pre className="bg-gray-100 p-2 rounded text-xs">
              {JSON.stringify(data.modulos_visibles, null, 2)}
            </pre>
          </div>

          <div className="text-sm mt-2">
            <strong>Permisos por módulo:</strong>
            <pre className="bg-gray-100 p-2 rounded text-xs">
              {JSON.stringify(data.permisos_modulo, null, 2)}
            </pre>
          </div>
        </section>
      )}

      {/* ============================
          AUDITORÍA (SOLO LECTURA)
      ============================ */}
      {tab === "auditoria" && (
        <section className="border p-4 rounded bg-white shadow">
          <h2 className="text-lg font-semibold mb-3">Auditoría</h2>

          <div className="space-y-2 text-sm">
            {data.auditoria.map((item) => (
              <div key={item.id} className="border rounded p-2 bg-gray-50">
                <div><strong>Fecha:</strong> {item.fecha}</div>
                <div><strong>Módulo:</strong> {item.modulo}</div>
                <div><strong>Acción:</strong> {item.accion}</div>
                <div><strong>Descripción:</strong> {item.descripcion}</div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
