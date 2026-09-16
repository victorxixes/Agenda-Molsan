import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { API_BASE } from "../../api/config";
import {
  obtenerFichaCompleta,
  actualizarModulosVisibles,
  actualizarPermisosModulo,
  subirFotoEmpleado,
  editarEmpleado,
  resetPasswordEmpleado,
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

  const mostrarToast = useCallback((tipo, mensaje) => {
    setToast({ tipo, mensaje });
    setTimeout(() => setToast(null), 3000);
  }, []);

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
          axios.get(`${API_BASE}/seguridad/roles`),
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

  const handleEmpleadoChange = useCallback((campo, valor) => {
    setEmpleado((e) => ({ ...e, [campo]: valor }));
  }, []);

  const handleFoto = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file || !empleado?.id) return;
      await subirFotoEmpleado(empleado.id, file);
      const res = await obtenerFichaCompleta(empleado.id);
      const d = res.data;
      setData(d);
      setEmpleado(d.empleado || {});
      mostrarToast("ok", "Foto actualizada");
    },
    [empleado?.id, mostrarToast]
  );

  const guardarEmpleado = useCallback(async () => {
    if (!empleado?.id) return;
    await editarEmpleado(empleado.id, { ...empleado });
    mostrarToast("ok", "Datos del empleado guardados");
  }, [empleado, mostrarToast]);

  const guardarModulos = useCallback(async () => {
    if (!empleado?.id) return;
    await actualizarModulosVisibles(empleado.id, modulos);
    mostrarToast("ok", "Módulos visibles guardados");
  }, [empleado?.id, modulos, mostrarToast]);

  const guardarPermisos = useCallback(async () => {
    if (!empleado?.id) return;
    await actualizarPermisosModulo(empleado.id, permisos);
    mostrarToast("ok", "Permisos guardados");
  }, [empleado?.id, permisos, mostrarToast]);

  const guardarRol = useCallback(async () => {
    if (!empleado?.id || !empleado?.rol?.id) return;

    await axios.post(
      `${API_BASE}/seguridad/asignar/empleado/${empleado.id}/rol/${empleado.rol.id}`
    );

    mostrarToast("ok", "Rol actualizado");
  }, [empleado?.id, empleado?.rol?.id, mostrarToast]);

  if (!open || !empleadoId) return null;

  return (
    <>
      {toast && (
        <div
          className={`
            fixed top-4 right-4 px-4 py-2 rounded-xl shadow-2xl text-white text-sm
            backdrop-blur-xl border border-white/20
            ${toast.tipo === "ok" ? "bg-green-500/30" : "bg-red-500/30"}
          `}
        >
          {toast.mensaje}
        </div>
      )}

      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            shadow-2xl w-[900px] max-h-[90vh] overflow-hidden text-white
          "
        >
          <div
            className="
              flex justify-between items-center px-6 py-4 border-b border-white/20
              bg-white/5 backdrop-blur-xl
            "
          >
            <h2 className="text-xl font-semibold drop-shadow">
              Ficha empleado {empleado.id} — {empleado.nombre}{" "}
              {empleado.apellidos}
            </h2>

            <button
              className="
                px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20
                text-white shadow-lg transition
              "
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>

          <div
            className="
              px-6 pt-3 pb-2 border-b border-white/20 flex gap-3 text-sm
              bg-white/5 backdrop-blur-xl
            "
          >
            {["basicos", "personales", "laborales", "seguridad", "auditoria"].map(
              (t) => (
                <button
                  key={t}
                  className={`
                    px-4 py-2 rounded-xl transition-all duration-200
                    ${
                      tab === t
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }
                  `}
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

          <div className="px-6 pb-6 pt-4 overflow-y-auto max-h-[75vh]">
            {loading && (
              <div className="text-sm text-white/70 animate-pulse">
                Cargando ficha…
              </div>
            )}

            {!loading && tab === "basicos" && (
              <section
                className="
                  bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
                  p-6 shadow-xl space-y-6
                "
              >
                <h3 className="text-lg font-semibold drop-shadow mb-4">
                  Datos básicos
                </h3>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="block mb-1 text-white/80">Estado</span>
                    <select
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.estado ?? 1}
                      onChange={(e) =>
                        handleEmpleadoChange("estado", Number(e.target.value))
                      }
                    >
                      <option value={1}>Activo</option>
                      <option value={0}>Baja</option>
                    </select>
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">Nombre</span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.nombre || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("nombre", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">Teléfono</span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.telefono || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("telefono", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">
                      Email empresa
                    </span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.email_empresa || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("email_empresa", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">Extensión</span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.extension || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("extension", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white focus:ring-2 focus:ring-blue-400
                      "
                      onChange={handleFoto}
                    />
                  </div>
                </div>

                <button
                  className="
                    mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
                    text-white shadow-lg transition
                  "
                  onClick={guardarEmpleado}
                >
                  Guardar datos básicos
                </button>
              </section>
            )}

            {!loading && tab === "personales" && (
              <section
                className="
                  bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
                  p-6 shadow-xl space-y-6
                "
              >
                <h3 className="text-lg font-semibold drop-shadow mb-4">
                  Datos personales
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block mb-1 text-white/80">Dirección</span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.direccion || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("direccion", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">
                      Código postal
                    </span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.codigo_postal || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("codigo_postal", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">Población</span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.poblacion || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("poblacion", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">Provincia</span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.provincia || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("provincia", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">
                      Fecha nacimiento
                    </span>
                    <input
                      type="date"
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.fecha_nacimiento || ""}
                      onChange={(e) =>
                        handleEmpleadoChange(
                          "fecha_nacimiento",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">Alergias</span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.alergias || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("alergias", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">
                      Persona contacto
                    </span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.persona_contacto || ""}
                      onChange={(e) =>
                        handleEmpleadoChange(
                          "persona_contacto",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">
                      Teléfono contacto
                    </span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.telefono_contacto || ""}
                      onChange={(e) =>
                        handleEmpleadoChange(
                          "telefono_contacto",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="col-span-2">
                    <span className="block mb-1 text-white/80">
                      Observaciones
                    </span>
                    <textarea
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white text-sm focus:ring-2 focus:ring-blue-400
                      "
                      rows={3}
                      value={empleado.observaciones || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("observaciones", e.target.value)
                      }
                    />
                  </div>
                </div>

                <button
                  className="
                    mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
                    text-white shadow-lg transition
                  "
                  onClick={guardarEmpleado}
                >
                  Guardar cambios
                </button>
              </section>
            )}

            {!loading && tab === "laborales" && (
              <section
                className="
                  bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
                  p-6 shadow-xl space-y-6
                "
              >
                <h3 className="text-lg font-semibold drop-shadow mb-4">
                  Datos laborales
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block mb-1 text-white/80">
                      Departamento
                    </span>
                    <select
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.departamento_id || ""}
                      onChange={(e) =>
                        handleEmpleadoChange(
                          "departamento_id",
                          Number(e.target.value)
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
                    <span className="block mb-1 text-white/80">Sección</span>
                    <select
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.seccion_id || ""}
                      onChange={(e) =>
                        handleEmpleadoChange(
                          "seccion_id",
                          Number(e.target.value)
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
                    <span className="block mb-1 text-white/80">Cargo</span>
                    <select
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.cargo_id || ""}
                      onChange={(e) =>
                        handleEmpleadoChange(
                          "cargo_id",
                          Number(e.target.value)
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

                  <div>
                    <span className="block mb-1 text-white/80">
                      Fecha alta
                    </span>
                    <input
                      type="date"
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.fecha_alta || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("fecha_alta", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">
                      Fecha baja
                    </span>
                    <input
                      type="date"
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.fecha_baja || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("fecha_baja", e.target.value)
                      }
                    />
                  </div>
                </div>

                <button
                  className="
                    mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
                    text-white shadow-lg transition
                  "
                  onClick={guardarEmpleado}
                >
                  Guardar datos laborales
                </button>
              </section>
            )}

            {!loading && tab === "seguridad" && (
              <section
                className="
                  bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
                  p-6 shadow-xl space-y-6
                "
              >
                <h3 className="text-lg font-semibold drop-shadow mb-4">
                  Seguridad interna
                </h3>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="block mb-1 text-white/80">Usuario</span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white/80 cursor-not-allowed
                      "
                      value={empleado.usuario || ""}
                      readOnly
                    />
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">Password</span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white/80 cursor-not-allowed
                      "
                      value="********"
                      readOnly
                    />
                  </div>
                </div>

                <div
                  className="
                    bg-white/5 border border-white/20 rounded-xl p-4 shadow-md
                    backdrop-blur-md
                  "
                >
                  <h4 className="font-semibold text-sm mb-3 text-white flex items-center gap-3">
                    Rol del empleado
                    <span
                      className="
                        px-3 py-1 bg-white/10 border border-white/20 rounded-xl
                        text-white/80 text-xs backdrop-blur-md
                      "
                    >
                      Actual:{" "}
                      <strong className="text-white">
                        {empleado?.rol?.nombre || "Sin rol"}
                      </strong>
                    </span>
                  </h4>

                  <div className="flex items-center gap-4 text-sm">
                    <select
                      className="
                        bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado?.rol?.id || ""}
                      onChange={(e) => {
                        const id = Number(e.target.value);
                        const rolObj =
                          roles.find((r) => r.id === id) || null;
                        handleEmpleadoChange("rol", rolObj);
                      }}
                    >
                      <option value="">Sin rol</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nombre}
                        </option>
                      ))}
                    </select>

                    <button
                      className="
                        px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
                        text-white shadow-lg transition
                      "
                      onClick={guardarRol}
                    >
                      Guardar rol
                    </button>

                    <button
                      className="
                        px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700
                        text-white shadow-lg transition
                      "
                      onClick={() => handleEmpleadoChange("rol", null)}
                    >
                      Reset rol
                    </button>
                  </div>
                </div>

                <button
                  className="
                    px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700
                    text-white shadow-lg transition
                  "
                  onClick={async () => {
                    await resetPasswordEmpleado(empleado.id);
                    mostrarToast("ok", "Contraseña reseteada");
                  }}
                >
                  Reset contraseña
                </button>

                <div className="flex gap-3 mt-6 text-sm">
                  <button
                    className={`
                      px-4 py-2 rounded-xl transition-all
                      ${
                        seguridadTab === "modulos"
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }
                    `}
                    onClick={() => setSeguridadTab("modulos")}
                  >
                    Módulos visibles
                  </button>

                  <button
                    className={`
                      px-4 py-2 rounded-xl transition-all
                      ${
                        seguridadTab === "permisos"
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }
                    `}
                    onClick={() => setSeguridadTab("permisos")}
                  >
                    Permisos por módulo
                  </button>
                </div>

                {seguridadTab === "modulos" && (
                  <div
                    className="
                      bg-white/5 border border-white/20 rounded-xl p-4 shadow-md
                      backdrop-blur-md
                    "
                  >
                    <h4 className="font-semibold text-sm mb-3 text-white">
                      Selecciona los módulos visibles
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-sm text-white/80">
                      {[
                        "dashboard",
                        "agenda",
                        "empleados",
                        "seguridad",
                        "auditoria",
                        "intranet",
                        "mensajes",
                        "utilidades",
                      ].map((mod) => (
                        <label key={mod} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={modulos.includes(mod)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setModulos([...modulos, mod]);
                              } else {
                                setModulos(
                                  modulos.filter((m) => m !== mod)
                                );
                              }
                            }}
                          />
                          {mod}
                        </label>
                      ))}
                    </div>

                    <button
                      className="
                        mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
                        text-white shadow-lg transition
                      "
                      onClick={guardarModulos}
                    >
                      Guardar módulos visibles
                    </button>

                    <button
                      className="
                        mt-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700
                        text-white shadow-lg transition
                      "
                      onClick={() => setModulos([])}
                    >
                      Reset módulos visibles
                    </button>
                  </div>
                )}

                {seguridadTab === "permisos" && (
                  <div
                    className="
                      bg-white/5 border border-white/20 rounded-xl p-4 shadow-md
                      backdrop-blur-md
                    "
                  >
                    <h4 className="font-semibold text-sm mb-3 text-white">
                      Permisos por módulo
                    </h4>

                    {Object.keys(permisos).map((mod) => (
                      <div key={mod} className="mb-4">
                        <span className="block font-semibold text-white mb-2 text-sm">
                          {mod.toUpperCase()}
                        </span>

                        <div className="grid grid-cols-4 gap-3 text-sm text-white/80">
                          {["ver", "crear", "editar", "eliminar"].map(
                            (perm) => (
                              <label
                                key={perm}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={permisos[mod]?.includes(perm)}
                                  onChange={(e) => {
                                    const actual = permisos[mod] || [];
                                    let nuevo;

                                    if (e.target.checked) {
                                      nuevo = [...actual, perm];
                                    } else {
                                      nuevo = actual.filter(
                                        (p) => p !== perm
                                      );
                                    }

                                    setPermisos({
                                      ...permisos,
                                      [mod]: nuevo,
                                    });
                                  }}
                                />
                                {perm}
                              </label>
                            )
                          )}
                        </div>
                      </div>
                    ))}

                    <button
                      className="
                        mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
                        text-white shadow-lg transition
                      "
                      onClick={guardarPermisos}
                    >
                      Guardar permisos
                    </button>

                    <button
                      className="
                        mt-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700
                        text-white shadow-lg transition
                      "
                      onClick={() => setPermisos({})}
                    >
                      Reset permisos
                    </button>
                  </div>
                )}
              </section>
            )}

            {!loading && tab === "auditoria" && (
              <section
                className="
                  border border-gray-300 bg-white p-4 rounded-xl shadow-sm
                "
              >
                <h3 className="text-sm font-semibold mb-3 text-gray-900">
                  Auditoría
                </h3>

                {(!auditoria || auditoria.length === 0) && (
                  <p className="text-gray-500 text-xs">
                    No hay registros de auditoría para este empleado.
                  </p>
                )}

                {auditoria && auditoria.length > 0 && (
                  <ul className="list-disc ml-5 text-xs text-gray-800">
                    {auditoria.map((a) => (
                      <li key={a.id}>
                        {new Date(a.fecha).toLocaleString("es-ES")} —{" "}
                        <strong>{a.modulo}</strong> [{a.accion}] —{" "}
                        {a.descripcion}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
