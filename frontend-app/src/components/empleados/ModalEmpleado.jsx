import { useEffect, useState } from "react";
import { API_BASE } from "../../api/config";
import {
  obtenerFichaCompleta,
  actualizarModulosVisibles,
  actualizarPermisosModulo,
  subirFotoEmpleado,
  editarEmpleado,
} from "../../api/empleados";
import { getMaestros } from "../../api/maestros";

export default function ModalEmpleado({ open, onClose, empleadoId }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const [empleado, setEmpleado] = useState({});
  const [modulos, setModulos] = useState([]);
  const [permisos, setPermisos] = useState({});
  const [auditoria, setAuditoria] = useState([]);

  const [departamentos, setDepartamentos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [cargos, setCargos] = useState([]);

  const [tab, setTab] = useState("datos");

  useEffect(() => {
    if (!open || !empleadoId) return;

    const cargar = async () => {
      setLoading(true);
      try {
        const res = await obtenerFichaCompleta(empleadoId);
        const d = res.data;

        setData(d);
        setEmpleado(d.empleado || {});
        setModulos(d.modulos_visibles || []);
        setPermisos(d.permisos_modulo || {});
        setAuditoria(d.auditoria || []);

        const [depRes, secRes, carRes] = await Promise.all([
          getMaestros("departamentos"),
          getMaestros("secciones"),
          getMaestros("cargos"),
        ]);

        setDepartamentos(depRes.data || []);
        setSecciones(secRes.data || []);
        setCargos(carRes.data || []);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [open, empleadoId]);

  const handleEmpleadoChange = (campo, valor) =>
    setEmpleado((e) => ({ ...e, [campo]: valor }));

  const handleFoto = async (e) => {
    const file = e.target.files[0];
    if (!file || !empleado?.id) return;
    await subirFotoEmpleado(empleado.id, file);
    const res = await obtenerFichaCompleta(empleado.id);
    const d = res.data;
    setData(d);
    setEmpleado(d.empleado || {});
  };

  const guardarEmpleado = async () => {
    if (!empleado?.id) return;
    await editarEmpleado(empleado.id, {
      nombre: empleado.nombre,
      apellidos: empleado.apellidos,
      telefono: empleado.telefono,
      email_empresa: empleado.email_empresa,
      activo: empleado.activo,
      departamento_id: empleado.departamento_id,
      seccion_id: empleado.seccion_id,
      cargo_id: empleado.cargo_id,
    });
  };

  const guardarModulos = async () => {
    if (!empleado?.id) return;
    await actualizarModulosVisibles(empleado.id, modulos);
  };

  const guardarPermisos = async () => {
    if (!empleado?.id) return;
    await actualizarPermisosModulo(empleado.id, permisos);
  };
  const rol = empleado?.rol || {};
  const departamento = data?.departamento || null;
  const seccion = data?.seccion || null;
  const cargo = data?.cargo || null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-[900px] max-h-[90vh] overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Ficha empleado #{empleado.id} — {empleado.nombre} {empleado.apellidos}
          </h2>
          <button
            className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

        <div className="flex gap-2 mb-4 text-sm">
          <button
            className={`px-3 py-1 rounded ${
              tab === "datos" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setTab("datos")}
          >
            Datos
          </button>
          <button
            className={`px-3 py-1 rounded ${
              tab === "seguridad" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setTab("seguridad")}
          >
            Seguridad
          </button>
          <button
            className={`px-3 py-1 rounded ${
              tab === "auditoria" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setTab("auditoria")}
          >
            Auditoría
          </button>
        </div>

        {loading && <div className="text-sm text-gray-500">Cargando ficha...</div>}

        {!loading && tab === "datos" && (
          <div className="space-y-6">
            {/* Datos básicos */}
            <section className="border p-4 rounded bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Datos básicos</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>Nombre:</strong>{" "}
                  <input
                    className="border p-1 rounded w-full"
                    value={empleado.nombre || ""}
                    onChange={(e) =>
                      handleEmpleadoChange("nombre", e.target.value)
                    }
                  />
                </div>
                <div>
                  <strong>Apellidos:</strong>{" "}
                  <input
                    className="border p-1 rounded w-full"
                    value={empleado.apellidos || ""}
                    onChange={(e) =>
                      handleEmpleadoChange("apellidos", e.target.value)
                    }
                  />
                </div>
                <div>
                  <strong>DNI:</strong> {empleado.dni}
                </div>
                <div>
                  <strong>Teléfono:</strong>{" "}
                  <input
                    className="border p-1 rounded w-full"
                    value={empleado.telefono || ""}
                    onChange={(e) =>
                      handleEmpleadoChange("telefono", e.target.value)
                    }
                  />
                </div>
                <div>
                  <strong>Email personal:</strong> {empleado.email_personal}
                </div>
                <div>
                  <strong>Email empresa:</strong>{" "}
                  <input
                    className="border p-1 rounded w-full"
                    value={empleado.email_empresa || ""}
                    onChange={(e) =>
                      handleEmpleadoChange("email_empresa", e.target.value)
                    }
                  />
                </div>
                <div>
                  <strong>Usuario:</strong> {empleado.usuario}
                </div>
                <div>
                  <strong>Rol:</strong> {rol?.nombre}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                {empleado.foto && (
                  <img
                    src={`${API_BASE}${empleado.foto}`}
                    alt="Foto empleado"
                    className="w-24 h-24 rounded object-cover border"
                  />
                )}
                <label className="text-sm">
                  Subir nueva foto:
                  <input
                    type="file"
                    className="block mt-1"
                    onChange={handleFoto}
                  />
                </label>
              </div>
            </section>

            {/* Maestros: nombres + selects */}
            <section className="border p-4 rounded bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-3">
                Datos laborales (maestros)
              </h3>

              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                <div>
                  <strong>Departamento actual:</strong>{" "}
                  {departamento?.nombre || "Sin departamento"}
                </div>
                <div>
                  <strong>Sección actual:</strong>{" "}
                  {seccion?.nombre || "Sin sección"}
                </div>
                <div>
                  <strong>Cargo actual:</strong>{" "}
                  {cargo?.nombre || "Sin cargo"}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <label className="block mb-1">Departamento</label>
                  <select
                    className="border p-2 rounded w-full"
                    value={empleado.departamento_id || ""}
                    onChange={(e) =>
                      handleEmpleadoChange(
                        "departamento_id",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                  >
                    <option value="">Sin departamento</option>
                    {departamentos.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Sección</label>
                  <select
                    className="border p-2 rounded w-full"
                    value={empleado.seccion_id || ""}
                    onChange={(e) =>
                      handleEmpleadoChange(
                        "seccion_id",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                  >
                    <option value="">Sin sección</option>
                    {secciones.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Cargo</label>
                  <select
                    className="border p-2 rounded w-full"
                    value={empleado.cargo_id || ""}
                    onChange={(e) =>
                      handleEmpleadoChange(
                        "cargo_id",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                  >
                    <option value="">Sin cargo</option>
                    {cargos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                className="mt-3 px-3 py-1 bg-green-600 text-white rounded text-sm"
                onClick={guardarEmpleado}
              >
                Guardar datos laborales
              </button>
            </section>
          </div>
        )}

        {!loading && tab === "seguridad" && (
          <div className="space-y-6">
            {/* Módulos visibles */}
            <section className="border p-4 rounded bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-3">
                Módulos visibles
              </h3>
              <textarea
                className="w-full border rounded p-2 text-xs"
                rows={4}
                value={JSON.stringify(modulos, null, 2)}
                onChange={(e) => {
                  try {
                    setModulos(JSON.parse(e.target.value));
                  } catch {
                    // ignorar
                  }
                }}
              />
              <button
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
                onClick={guardarModulos}
              >
                Guardar módulos visibles
              </button>
            </section>

            {/* Permisos por módulo */}
            <section className="border p-4 rounded bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-3">
                Permisos por módulo
              </h3>
              <textarea
                className="w-full border rounded p-2 text-xs"
                rows={6}
                value={JSON.stringify(permisos, null, 2)}
                onChange={(e) => {
                  try {
                    setPermisos(JSON.parse(e.target.value));
                  } catch {
                    // ignorar
                  }
                }}
              />
              <button
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
                onClick={guardarPermisos}
              >
                Guardar permisos
              </button>
            </section>
          </div>
        )}

        {!loading && tab === "auditoria" && (
          <div className="space-y-3">
            <h3 className="font-semibold mb-2">Auditoría</h3>

            {(!auditoria || auditoria.length === 0) && (
              <p className="text-gray-500 text-xs">
                No hay registros de auditoría para este empleado.
              </p>
            )}

            {auditoria && auditoria.length > 0 && (
              <ul className="list-disc ml-6 text-xs">
                {auditoria.map((a) => (
                  <li key={a.id}>
                    {new Date(a.fecha).toLocaleString()} —{" "}
                    <strong>{a.modulo}</strong> [{a.accion}] — {a.descripcion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

  if (!open || !empleadoId) return null;
