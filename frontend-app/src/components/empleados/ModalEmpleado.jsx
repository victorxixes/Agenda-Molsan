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

  const [tab, setTab] = useState("basicos");

  const [toast, setToast] = useState(null);

  const mostrarToast = (tipo, mensaje) => {
    setToast({ tipo, mensaje });
    setTimeout(() => setToast(null), 3000);
  };

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
    mostrarToast("ok", "Foto actualizada");
  };

  const guardarEmpleado = async () => {
    if (!empleado?.id) return;
    await editarEmpleado(empleado.id, { ...empleado });
    mostrarToast("ok", "Datos del empleado guardados");
  };

  const guardarModulos = async () => {
    if (!empleado?.id) return;
    await actualizarModulosVisibles(empleado.id, modulos);
    mostrarToast("ok", "Módulos visibles guardados");
  };

  const guardarPermisos = async () => {
    if (!empleado?.id) return;
    await actualizarPermisosModulo(empleado.id, permisos);
    mostrarToast("ok", "Permisos guardados");
  };

  if (!open || !empleadoId) return null;

  const rol = empleado?.rol || {};
  const departamento = data?.departamento || null;
  const seccion = data?.seccion || null;
  const cargo = data?.cargo || null;
  return (
    <>
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white text-sm transition-all ${
            toast.tipo === "ok" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.mensaje}
        </div>
      )}

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-neutral-900 rounded-xl shadow-lg w-[900px] max-h-[90vh] overflow-hidden border border-neutral-700">
          <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-700 bg-neutral-950">
            <h2 className="text-lg font-semibold text-neutral-100">
              Ficha empleado #{empleado.id} — {empleado.nombre} {empleado.apellidos}
            </h2>
            <button
              className="px-3 py-1 text-xs rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>

          <div className="px-4 pt-3 pb-2 border-b border-neutral-800 flex gap-2 text-xs bg-neutral-900">
            {["basicos", "personales", "laborales", "seguridad", "auditoria"].map(
              (t) => (
                <button
                  key={t}
                  className={`px-3 py-1 rounded-full transition-all duration-200 ${
                    tab === t
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
                  onClick={() => setTab(t)}
                >
                  {t === "basicos" && "Datos básicos"}
                  {t === "personales" && "Datos personales"}
                  {t === "laborales" && "Datos laborales"}
                  {t === "seguridad" && "Seguridad"}
                  {t === "auditoria" && "Auditoría"}
                </button>
              )
            )}
          </div>

          <div className="px-4 pb-4 pt-2 overflow-y-auto max-h-[75vh]">
            {loading && (
              <div className="text-sm text-neutral-400">Cargando ficha...</div>
            )}
            {!loading && tab === "basicos" && (
              <div className="transition-all duration-200 ease-out transform">
                <section className="border border-neutral-700 bg-neutral-900 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-semibold mb-3 text-neutral-100">
                    Datos básicos
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="block mb-1 text-neutral-300">Nombre</span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.nombre || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("nombre", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-neutral-300">Teléfono</span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.telefono || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("telefono", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-neutral-300">
                        Email empresa
                      </span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.email_empresa || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("email_empresa", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-neutral-300">Extensión</span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.extension || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("extension", e.target.value)
                        }
                      />
                    </div>

                    <div className="mt-2">
                      <label className="inline-flex items-center gap-2 text-neutral-300">
                        <input
                          type="checkbox"
                          checked={empleado.activo ?? true}
                          onChange={(e) =>
                            handleEmpleadoChange("activo", e.target.checked)
                          }
                        />
                        Activo
                      </label>
                    </div>
                  </div>

                  <button
                    className="mt-4 px-3 py-1 bg-blue-600 text-white rounded text-xs"
                    onClick={guardarEmpleado}
                  >
                    Guardar datos básicos
                  </button>
                </section>
              </div>
            )}

            {!loading && tab === "personales" && (
              <div className="transition-all duration-200 ease-out transform">
                <section className="border border-neutral-700 bg-neutral-900 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-semibold mb-3 text-neutral-100">
                    Datos personales
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="block mb-1 text-neutral-300">Apellidos</span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.apellidos || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("apellidos", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-neutral-300">DNI</span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.dni || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("dni", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-neutral-300">
                        Email personal
                      </span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.email_personal || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("email_personal", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-neutral-300">Dirección</span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.direccion || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("direccion", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-neutral-300">
                        Código postal
                      </span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.codigo_postal || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("codigo_postal", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-neutral-300">Población</span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.poblacion || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("poblacion", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-neutral-300">Provincia</span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.provincia || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("provincia", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-neutral-300">
                        Fecha nacimiento
                      </span>
                      <input
                        type="date"
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.fecha_nacimiento || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("fecha_nacimiento", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-neutral-300">Alergias</span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.alergias || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("alergias", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-neutral-300">
                        Persona contacto
                      </span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.persona_contacto || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("persona_contacto", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-neutral-300">
                        Teléfono contacto
                      </span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.telefono_contacto || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("telefono_contacto", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-span-2">
                      <span className="block mb-1 text-neutral-300">
                        Observaciones
                      </span>
                      <textarea
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        rows={3}
                        value={empleado.observaciones || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("observaciones", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    {empleado.foto && (
                      <img
                        src={`${API_BASE}${empleado.foto}`}
                        alt="Foto empleado"
                        className="w-20 h-20 rounded object-cover border border-neutral-700"
                      />
                    )}
                    <label className="text-xs text-neutral-300">
                      Subir nueva foto:
                      <input
                        type="file"
                        className="block mt-1 text-xs"
                        onChange={handleFoto}
                      />
                    </label>
                  </div>

                  <button
                    className="mt-4 px-3 py-1 bg-blue-600 text-white rounded text-xs"
                    onClick={guardarEmpleado}
                  >
                    Guardar datos personales
                  </button>
                </section>
              </div>
            )}
            {!loading && tab === "laborales" && (
              <div className="transition-all duration-200 ease-out transform">
                <section className="border border-neutral-700 bg-neutral-900 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-semibold mb-3 text-neutral-100">
                    Datos laborales
                  </h3>

                  <div className="grid grid-cols-3 gap-2 text-xs mb-3 text-neutral-300">
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

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="block mb-1 text-neutral-300">
                        Departamento
                      </span>
                      <select
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.departamento_id || ""}
                        onChange={(e) =>
                          handleEmpleadoChange(
                            "departamento_id",
                            Number(e.target.value) || null
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
                      <span className="block mb-1 text-neutral-300">Sección</span>
                      <select
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.seccion_id || ""}
                        onChange={(e) =>
                          handleEmpleadoChange(
                            "seccion_id",
                            Number(e.target.value) || null
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
                      <span className="block mb-1 text-neutral-300">Cargo</span>
                      <select
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                        value={empleado.cargo_id || ""}
                        onChange={(e) =>
                          handleEmpleadoChange(
                            "cargo_id",
                            Number(e.target.value) || null
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

                  <div className="grid grid-cols-2 gap-3 text-xs mt-4 text-neutral-300">
                    <div>
                      <strong>Fecha alta:</strong>{" "}
                      {empleado.fecha_alta || "-"}
                    </div>
                    <div>
                      <strong>Fecha baja:</strong>{" "}
                      {empleado.fecha_baja || "-"}
                    </div>
                  </div>

                  <button
                    className="mt-4 px-3 py-1 bg-blue-600 text-white rounded text-xs"
                    onClick={guardarEmpleado}
                  >
                    Guardar datos laborales
                  </button>
                </section>
              </div>
            )}

            {!loading && tab === "seguridad" && (
              <div className="transition-all duration-200 ease-out transform">
                <section className="border border-neutral-700 bg-neutral-900 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-semibold mb-3 text-neutral-100">
                    Seguridad interna
                  </h3>

                  <div className="grid grid-cols-3 gap-3 text-xs mb-4">
                    <div>
                      <span className="block mb-1 text-neutral-300">Usuario</span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-400 text-xs"
                        value={empleado.usuario || ""}
                        readOnly
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-neutral-300">Password</span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-400 text-xs"
                        value="********"
                        readOnly
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-neutral-300">Rol</span>
                      <input
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-400 text-xs"
                        value={rol.nombre || "Sin rol"}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold mb-2 text-xs text-neutral-100">
                      Módulos visibles
                    </h4>
                    <textarea
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs"
                      rows={4}
                      value={JSON.stringify(modulos, null, 2)}
                      onChange={(e) => {
                        try {
                          setModulos(JSON.parse(e.target.value));
                        } catch {}
                      }}
                    />
                    <button
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs"
                      onClick={guardarModulos}
                    >
                      Guardar módulos visibles
                    </button>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2 text-xs text-neutral-100">
                      Permisos por módulo
                    </h4>
                    <textarea
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-neutral-100 text-xs"
                      rows={6}
                      value={JSON.stringify(permisos, null, 2)}
                      onChange={(e) => {
                        try {
                          setPermisos(JSON.parse(e.target.value));
                        } catch {}
                      }}
                    />
                    <button
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs"
                      onClick={guardarPermisos}
                    >
                      Guardar permisos
                    </button>
                  </div>
                </section>
              </div>
            )}

            {!loading && tab === "auditoria" && (
              <div className="transition-all duration-200 ease-out transform">
                <section className="border border-neutral-700 bg-neutral-900 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-semibold mb-3 text-neutral-100">
                    Auditoría
                  </h3>

                  {(!auditoria || auditoria.length === 0) && (
                    <p className="text-neutral-400 text-xs">
                      No hay registros de auditoría para este empleado.
                    </p>
                  )}

                  {auditoria && auditoria.length > 0 && (
  <ul className="list-disc ml-5 text-xs text-neutral-200">
    {auditoria.map((a) => (
      <li key={a.id}>
        {new Date(a.fecha).toLocaleString()} —{" "}
        <strong>{a.modulo}</strong> [{a.accion}] —{" "}
        {a.descripcion}
      </li>
    ))}
  </ul>
)}
</section>
</div>
)}
</div>
</div>
</div>
</>
);
}
