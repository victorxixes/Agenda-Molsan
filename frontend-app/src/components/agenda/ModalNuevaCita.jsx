import { useEffect, useState } from "react";
import { API_BASE } from "../../api/config";
import {
  obtenerFichaCompleta,
  actualizarModulosVisibles,
  actualizarPermisosModulo,
  subirFotoEmpleado,
  editarEmpleado,
  resetPasswordEmpleado
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
  const [roles, setRoles] = useState([]);

  const [tab, setTab] = useState("basicos");
  const [seguridadTab, setSeguridadTab] = useState("modulos");

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

        const [depRes, secRes, carRes, rolesRes] = await Promise.all([
          getMaestros("departamentos"),
          getMaestros("secciones"),
          getMaestros("cargos"),
          getMaestros("roles")
        ]);

        setDepartamentos(depRes.data || []);
        setSecciones(secRes.data || []);
        setCargos(carRes.data || []);
        setRoles(rolesRes.data || []);
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
        <div className="bg-white rounded-xl shadow-lg w-[900px] max-h-[90vh] overflow-hidden border border-gray-300">

          {/* HEADER */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Ficha empleado #{empleado.id} — {empleado.nombre} {empleado.apellidos}
            </h2>
            <button
              className="px-3 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>

          {/* TABS PRINCIPALES */}
          <div className="px-4 pt-3 pb-2 border-b border-gray-200 flex gap-2 text-xs bg-white">
            {["basicos", "personales", "laborales", "seguridad", "auditoria"].map(
              (t) => (
                <button
                  key={t}
                  className={`px-3 py-1 rounded-full transition-all duration-200 ${
                    tab === t
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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

          {/* CONTENIDO */}
          <div className="px-4 pb-4 pt-2 overflow-y-auto max-h-[75vh] bg-white">
            {loading && (
              <div className="text-sm text-gray-500">Cargando ficha...</div>
            )}

            {/* DATOS BÁSICOS */}
            {!loading && tab === "basicos" && (
              <div className="transition-all duration-200 ease-out transform">
                <section className="border border-gray-300 bg-white p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-semibold mb-3 text-gray-900">
                    Datos básicos
                  </h3>

                  <div className="grid grid-cols-3 gap-3 text-xs">

                    {/* Activo */}
                    <div>
                      <span className="block mb-1 text-gray-700">Estado</span>
                      <select
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.activo ? "1" : "0"}
                        onChange={(e) =>
                          handleEmpleadoChange("activo", e.target.value === "1")
                        }
                      >
                        <option value="1">Activo</option>
                        <option value="0">Baja</option>
                      </select>
                    </div>

                    {/* Email empresa */}
                    <div>
                      <span className="block mb-1 text-gray-700">Email empresa</span>
                      <input
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.email_empresa || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("email_empresa", e.target.value)
                        }
                      />
                    </div>

                    {/* Extensión */}
                    <div>
                      <span className="block mb-1 text-gray-700">Extensión</span>
                      <input
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.extension || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("extension", e.target.value)
                        }
                      />
                    </div>

                    {/* Usuario */}
                    <div>
                      <span className="block mb-1 text-gray-700">Usuario</span>
                      <input
                        className="w-full bg-gray-100 border border-gray-300 rounded-md px-2 py-1 text-gray-600 text-xs"
                        value={empleado.usuario || ""}
                        readOnly
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <span className="block mb-1 text-gray-700">Password</span>
                      <input
                        className="w-full bg-gray-100 border border-gray-300 rounded-md px-2 py-1 text-gray-600 text-xs"
                        value="********"
                        readOnly
                      />
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

            {/* DATOS PERSONALES */}
            {!loading && tab === "personales" && (
              <div className="transition-all duration-200 ease-out transform">
                <section className="border border-gray-300 bg-white p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-semibold mb-3 text-gray-900">
                    Datos personales
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="block mb-1 text-gray-700">Apellidos</span>
                      <input
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.apellidos || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("apellidos", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-gray-700">DNI</span>
                      <input
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.dni || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("dni", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-gray-700">Email personal</span>
                      <input
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.email_personal || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("email_personal", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-gray-700">Dirección</span>
                      <input
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.direccion || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("direccion", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-gray-700">Código postal</span>
                      <input
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.codigo_postal || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("codigo_postal", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-gray-700">Población</span>
                      <input
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.poblacion || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("poblacion", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-gray-700">Provincia</span>
                      <input
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.provincia || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("provincia", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-gray-700">Fecha nacimiento</span>
                      <input
                        type="date"
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.fecha_nacimiento || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("fecha_nacimiento", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-gray-700">Alergias</span>
                      <input
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.alergias || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("alergias", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-gray-700">Persona contacto</span>
                      <input
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.persona_contacto || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("persona_contacto", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-gray-700">Teléfono contacto</span>
                      <input
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.telefono_contacto || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("telefono_contacto", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-span-2">
                      <span className="block mb-1 text-gray-700">Observaciones</span>
                      <textarea
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
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
                        className="w-20 h-20 rounded object-cover border border-gray-300"
                      />
                    )}
                    <label className="text-xs text-gray-700">
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

            {/* DATOS LABORALES */}
            {!loading && tab === "laborales" && (
              <div className="transition-all duration-200 ease-out transform">
                <section className="border border-gray-300 bg-white p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-semibold mb-3 text-gray-900">
                    Datos laborales
                  </h3>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="block mb-1 text-gray-700">Departamento</span>
                      <select
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
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
                      <span className="block mb-1 text-gray-700">Sección</span>
                      <select
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
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
                      <span className="block mb-1 text-gray-700">Cargo</span>
                      <select
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
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
                      </                         ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs mt-4 text-gray-700">
                    <div>
                      <span className="block mb-1 text-gray-700">Fecha alta</span>
                      <input
                        type="date"
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.fecha_alta || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("fecha_alta", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <span className="block mb-1 text-gray-700">Fecha baja</span>
                      <input
                        type="date"
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.fecha_baja || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("fecha_baja", e.target.value)
                        }
                      />
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

            {/* SEGURIDAD */}
            {!loading && tab === "seguridad" && (
              <div className="transition-all duration-200 ease-out transform">
                <section className="border border-gray-300 bg-white p-4 rounded-xl shadow-sm">

                  {/* SUBTABS */}
                  <div className="flex gap-2 mb-3 text-xs">
                    <button
                      className={`px-3 py-1 rounded-full ${
                        seguridadTab === "modulos"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setSeguridadTab("modulos")}
                    >
                      Módulos visibles
                    </button>

                    <button
                      className={`px-3 py-1 rounded-full ${
                        seguridadTab === "permisos"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setSeguridadTab("permisos")}
                    >
                      Permisos por módulo
                    </button>

                    <button
                      className={`px-3 py-1 rounded-full ${
                        seguridadTab === "rol"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setSeguridadTab("rol")}
                    >
                      Rol
                    </button>
                  </div>

                  {/* MÓDULOS VISIBLES */}
                  {seguridadTab === "modulos" && (
                    <div className="text-xs">
                      <h4 className="font-semibold mb-2">Módulos visibles</h4>

                      <div className="grid grid-cols-3 gap-2">
                        {["agenda", "empleados", "mensajes", "intranet"].map((m) => (
                          <label key={m} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={modulos.includes(m)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setModulos([...modulos, m]);
                                } else {
                                  setModulos(modulos.filter((x) => x !== m));
                                }
                              }}
                            />
                            {m}
                          </label>
                        ))}
                      </div>

                      <button
                        className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-xs"
                        onClick={guardarModulos}
                      >
                        Guardar módulos visibles
                      </button>
                    </div>
                  )}

                  {/* PERMISOS */}
                  {seguridadTab === "permisos" && (
                    <div className="text-xs">
                      <h4 className="font-semibold mb-2">Permisos por módulo</h4>

                      {Object.keys(permisos).length === 0 && (
                        <p className="text-gray-500">No hay permisos configurados.</p>
                      )}

                      {Object.entries(permisos).map(([modulo, acciones]) => (
                        <div key={modulo} className="mb-3">
                          <h5 className="font-semibold">{modulo}</h5>

                          <div className="flex gap-3 mt-1">
                            {["ver", "crear", "editar", "eliminar"].map((accion) => (
                              <label key={accion} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={acciones.includes(accion)}
                                  onChange={(e) => {
                                    const nuevasAcciones = e.target.checked
                                      ? [...acciones, accion]
                                      : acciones.filter((a) => a !== accion);

                                    setPermisos({
                                      ...permisos,
                                      [modulo]: nuevasAcciones
                                    });
                                  }}
                                />
                                {accion}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-xs"
                        onClick={guardarPermisos}
                      >
                        Guardar permisos
                      </button>
                    </div>
                  )}

                  {/* ROL */}
                  {seguridadTab === "rol" && (
                    <div className="text-xs">
                      <h4 className="font-semibold mb-2">Rol del empleado</h4>

                      <select
                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-xs"
                        value={empleado.rol?.id || ""}
                        onChange={(e) =>
                          handleEmpleadoChange("rol", {
                            id: Number(e.target.value)
                          })
                        }
                      >
                        <option value="">Sin rol</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.nombre}
                          </option>
                        ))}
                      </select>

                      <button
                        className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-xs"
                        onClick={guardarEmpleado}
                      >
                        Guardar rol
                      </button>
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* AUDITORÍA */}
            {!loading && tab === "auditoria" && (
              <div className="transition-all duration-200 ease-out transform">
                <section className="border border-gray-300 bg-white p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-semibold mb-3 text-gray-900">
                    Auditoría del empleado
                  </h3>

                  {auditoria.length === 0 ? (
                    <p className="text-xs text-gray-500">
                      No hay registros de auditoría para este empleado.
                    </p>
                  ) : (
                    <ul className="text-xs text-gray-700 space-y-2">
                      {auditoria.map((a) => (
                        <li key={a.id} className="border-b pb-2">
                          <strong>{a.fecha}</strong> — {a.modulo} [{a.accion}]  
                          <br />
                          {a.descripcion}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            )}
          </div> {/* cierre contenido */}
        </div> {/* cierre caja modal */}
      </div> {/* cierre overlay */}
    </>
  );
}
