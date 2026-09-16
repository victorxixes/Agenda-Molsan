import axios from "axios";
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
          axios.get(`${API_BASE}/seguridad/roles`)
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

  const guardarRol = async () => {
    if (!empleado?.id || !empleado?.rol_id) return;

    await axios.post(
      `${API_BASE}/seguridad/asignar/empleado/${empleado.id}/rol/${empleado.rol_id}`
    );

    mostrarToast("ok", "Rol actualizado");
  };

  if (!open || !empleadoId) return null;

  return (
    <>
      {/* TOAST PREMIUM */}
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

      {/* OVERLAY PREMIUM */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

        {/* MODAL PREMIUM */}
        <div className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          shadow-2xl w-[900px] max-h-[90vh] overflow-hidden text-white
        ">

          {/* HEADER PREMIUM */}
          <div className="
            flex justify-between items-center px-6 py-4 border-b border-white/20
            bg-white/5 backdrop-blur-xl
          ">
            <h2 className="text-xl font-semibold drop-shadow">
              Ficha empleado {empleado.id} — {empleado.nombre} {empleado.apellidos}
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

          {/* TABS PRINCIPALES PREMIUM */}
          <div className="
            px-6 pt-3 pb-2 border-b border-white/20 flex gap-3 text-sm
            bg-white/5 backdrop-blur-xl
          ">
            {["basicos", "personales", "laborales", "seguridad", "auditoria"].map(
              (t) => (
                <button
                  key={t}
                  className={`
                    px-4 py-2 rounded-xl transition-all duration-200
                    ${tab === t
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white/10 text-white/70 hover:bg-white/20"}
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

          {/* CONTENIDO PREMIUM */}
          <div className="px-6 pb-6 pt-4 overflow-y-auto max-h-[75vh]">

            {loading && (
              <div className="text-sm text-white/70 animate-pulse">
                Cargando ficha…
              </div>
            )}

            {/* ============================
                TAB 1: DATOS BÁSICOS
            ============================ */}
            {!loading && tab === "basicos" && (
              <section className="
                bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
                p-6 shadow-xl space-y-6
              ">
                <h3 className="text-lg font-semibold drop-shadow mb-4">
                  Datos básicos
                </h3>

                <div className="grid grid-cols-3 gap-4 text-sm">

                  {/* Estado */}
                  <div>
                    <span className="block mb-1 text-white/80">Estado</span>
                    <select
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.rol?.id || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("rol", {
                          id: Number(e.target.value),
                          nombre:
                            roles.find(
                              (r) => r.id === Number(e.target.value)
                            )?.nombre || ""
                        })
                      }
                    >
                      <option value="1">Activo</option>
                      <option value="0">Baja</option>
                    </select>
                  </div>

                  {/* Nombre */}
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

                  {/* Teléfono */}
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

                  {/* Email empresa */}
                  <div>
                    <span className="block mb-1 text-white/80">Email empresa</span>
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

                  {/* Extensión */}
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

            {/* ============================
                TAB 2: DATOS PERSONALES
            ============================ */}
            {!loading && tab === "personales" && (
              <section className="
                bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
                p-6 shadow-xl space-y-6
              ">
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
                    <span className="block mb-1 text-white/80">Código postal</span>
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
                    <span className="block mb-1 text-white/80">Fecha nacimiento</span>
                    <input
                      type="date"
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.fecha_nacimiento || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("fecha_nacimiento", e.target.value)
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
                    <span className="block mb-1 text-white/80">Persona contacto</span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.persona_contacto || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("persona_contacto", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">Teléfono contacto</span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.telefono_contacto || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("telefono_contacto", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-span-2">
                    <span className="block mb-1 text-white/80">Observaciones</span>
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
                  onClick={guardarCambios}
                >
                  Guardar cambios
                </button>
              </section>
            )}

            {/* ============================
                TAB 3: DATOS LABORALES
            ============================ */}
            {!loading && tab === "laborales" && (
              <section className="
                bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
                p-6 shadow-xl space-y-6
              ">
                <h3 className="text-lg font-semibold drop-shadow mb-4">
                  Datos laborales
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">

                  <div>
                    <span className="block mb-1 text-white/80">Departamento ID</span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.departamento_id || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("departamento_id", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">Sección ID</span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.seccion_id || ""}
                      onChange={(e) =>
                        handleEmpleadoChange("seccion_id", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <span className="block mb-1 text-white/80">Cargo ID</span>
                    <input
                      className="
                        w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                        text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                      "
                      value={empleado.cargo_id || ""}
onChange={(e) =>
  handleEmpleadoChange(
    "cargo_id",
    Number(e.target.value) || null
  )
}
/>

                        {/* ============================
    TAB 2: DATOS PERSONALES — SaaS Premium
============================ */}
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

      {/* Nombre */}
      <div>
        <span className="block mb-1 text-white/80">Nombre</span>
        <input
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          value={empleado.nombre || ""}
          onChange={(e) => handleEmpleadoChange("nombre", e.target.value)}
        />
      </div>

      {/* Teléfono */}
      <div>
        <span className="block mb-1 text-white/80">Teléfono</span>
        <input
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          value={empleado.telefono || ""}
          onChange={(e) => handleEmpleadoChange("telefono", e.target.value)}
        />
      </div>

      {/* Apellidos */}
      <div>
        <span className="block mb-1 text-white/80">Apellidos</span>
        <input
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          value={empleado.apellidos || ""}
          onChange={(e) => handleEmpleadoChange("apellidos", e.target.value)}
        />
      </div>

      {/* DNI */}
      <div>
        <span className="block mb-1 text-white/80">DNI</span>
        <input
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          value={empleado.dni || ""}
          onChange={(e) => handleEmpleadoChange("dni", e.target.value)}
        />
      </div>

      {/* Email personal */}
      <div>
        <span className="block mb-1 text-white/80">Email personal</span>
        <input
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          value={empleado.email_personal || ""}
          onChange={(e) => handleEmpleadoChange("email_personal", e.target.value)}
        />
      </div>

      {/* Dirección */}
      <div>
        <span className="block mb-1 text-white/80">Dirección</span>
        <input
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          value={empleado.direccion || ""}
          onChange={(e) => handleEmpleadoChange("direccion", e.target.value)}
        />
      </div>

      {/* Código postal */}
      <div>
        <span className="block mb-1 text-white/80">Código postal</span>
        <input
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          value={empleado.codigo_postal || ""}
          onChange={(e) => handleEmpleadoChange("codigo_postal", e.target.value)}
        />
      </div>

      {/* Población */}
      <div>
        <span className="block mb-1 text-white/80">Población</span>
        <input
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          value={empleado.poblacion || ""}
          onChange={(e) => handleEmpleadoChange("poblacion", e.target.value)}
        />
      </div>

      {/* Provincia */}
      <div>
        <span className="block mb-1 text-white/80">Provincia</span>
        <input
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          value={empleado.provincia || ""}
          onChange={(e) => handleEmpleadoChange("provincia", e.target.value)}
        />
      </div>

      {/* Fecha nacimiento */}
      <div>
        <span className="block mb-1 text-white/80">Fecha nacimiento</span>
        <input
          type="date"
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white focus:ring-2 focus:ring-blue-400
          "
          value={empleado.fecha_nacimiento || ""}
          onChange={(e) => handleEmpleadoChange("fecha_nacimiento", e.target.value)}
        />
      </div>

      {/* Alergias */}
      <div>
        <span className="block mb-1 text-white/80">Alergias</span>
        <input
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          value={empleado.alergias || ""}
          onChange={(e) => handleEmpleadoChange("alergias", e.target.value)}
        />
      </div>

      {/* Persona contacto */}
      <div>
        <span className="block mb-1 text-white/80">Persona contacto</span>
        <input
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          value={empleado.persona_contacto || ""}
          onChange={(e) => handleEmpleadoChange("persona_contacto", e.target.value)}
        />
      </div>

      {/* Teléfono contacto */}
      <div>
        <span className="block mb-1 text-white/80">Teléfono contacto</span>
        <input
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          value={empleado.telefono_contacto || ""}
          onChange={(e) => handleEmpleadoChange("telefono_contacto", e.target.value)}
        />
      </div>

      {/* Observaciones */}
      <div className="col-span-2">
        <span className="block mb-1 text-white/80">Observaciones</span>
        <textarea
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white text-sm focus:ring-2 focus:ring-blue-400
          "
          rows={3}
          value={empleado.observaciones || ""}
          onChange={(e) => handleEmpleadoChange("observaciones", e.target.value)}
        />
      </div>

      {/* Foto */}
      <div className="mt-4 flex items-center gap-4">
        {empleado.foto_url && (
          <img
            src={`${API_BASE}${empleado.foto_url}?v=${Date.now()}`}
            alt="Foto empleado"
            className="
              w-20 h-20 rounded-full object-cover border border-white/20
              shadow-xl
            "
          />
        )}

        <label className="text-xs text-white/80">
          Subir nueva foto:
          <input
            type="file"
            className="block mt-1 text-xs text-white"
            onChange={handleFoto}
          />
        </label>
      </div>
    </div>

    <button
      className="
        mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
        text-white shadow-lg transition
      "
      onClick={guardarEmpleado}
    >
      Guardar datos personales
    </button>
  </section>
)}

                    {/* ============================
    TAB 3: DATOS LABORALES — SaaS Premium
============================ */}
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

    <div className="grid grid-cols-3 gap-4 text-sm">

      {/* Departamento */}
      <div>
        <span className="block mb-1 text-white/80">Departamento</span>
        <select
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white focus:ring-2 focus:ring-blue-400
          "
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

      {/* Sección */}
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

      {/* Cargo */}
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

    {/* Fechas */}
    <div className="grid grid-cols-2 gap-4 text-sm mt-4">

      {/* Fecha alta */}
      <div>
        <span className="block mb-1 text-white/80">Fecha alta</span>
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

      {/* Fecha baja */}
      <div>
        <span className="block mb-1 text-white/80">Fecha baja</span>
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

{/* ============================
    TAB 5: AUDITORÍA
============================ */}
{!loading && tab === "auditoria" && (
  <div className="transition-all duration-200 ease-out transform">
    <section className="
      bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
      p-6 shadow-xl space-y-4
    ">
      <h3 className="text-lg font-semibold text-white drop-shadow mb-3">
        Auditoría
      </h3>

      {(!auditoria || auditoria.length === 0) && (
        <p className="text-white/70 text-sm">
          No hay registros de auditoría para este empleado.
        </p>
      )}

      {auditoria && auditoria.length > 0 && (
        <ul className="space-y-2 text-sm text-white/80">
          {auditoria.map((a) => (
            <li
              key={a.id}
              className="
                bg-white/5 border border-white/20 rounded-xl p-3
                shadow-md backdrop-blur-md
              "
            >
              {new Date(a.fecha).toLocaleString()} —{" "}
              <strong className="text-white">{a.modulo}</strong> [{a.accion}] — {a.descripcion}
            </li>
          ))}
        </ul>
      )}
    </section>
  </div>
)}

</div> {/* ← cierre del contenedor interno de tabs */}

</div> {/* ← cierre del cuerpo del modal */}

</div> {/* ← cierre del overlay */}

</> {/* ← cierre del fragment */}

); {/* ← cierre del return */}

} {/* ← cierre del componente */}
