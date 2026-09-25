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
import SelectSJ from "../ui/SelectSJ";

// ⭐ Módulos oficiales SJ‑2026
const MODULOS_SJ2026 = [
  "dashboard",
  "agenda",
  "empleados",
  "ctn",
  "intranet",
  "mensajes",
  "noticias",
  "documentos",
  "auditoria",
  "logs",
  "seguridad",
  "utilidades",
  "maestros",
  "realtime",
  "herramientas",
  "panel-tecnico",
  "notificaciones",
  "expedientes"
];

// ⭐ Permisos estándar SJ‑2026
const PERMISOS_SJ2026 = ["ver", "crear", "editar", "eliminar"];

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
      {/* HEADER */}
      <div
        className="
          flex justify-between items-center px-6 py-4 border-b border-white/20
          bg-white/5 backdrop-blur-xl
        "
      >
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

      {/* TABS PRINCIPALES */}
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

      {/* CONTENIDO SCROLLEABLE */}
      <div className="px-6 pb-6 pt-4 overflow-y-auto max-h-[75vh]">
        {loading && (
          <div className="text-sm text-white/70 animate-pulse">
            Cargando ficha…
          </div>
        )}

        {/* TAB: BÁSICOS */}
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
                <SelectSJ
                  value={empleado.estado ?? 1}
                  onChange={(v) => handleEmpleadoChange("estado", Number(v))}
                  options={[
                    { value: 1, label: "Activo" },
                    { value: 0, label: "Baja" },
                  ]}
                />
              </div>

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
{/* TAB: PERSONALES */}
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

    {/* PRIMER BLOQUE */}
    <div className="grid grid-cols-3 gap-4 text-sm">

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
    </div>

    {/* SEGUNDO BLOQUE */}
    <div className="grid grid-cols-2 gap-4 text-sm">

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
          onChange={(e) =>
            handleEmpleadoChange("fecha_nacimiento", e.target.value)
          }
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
          onChange={(e) =>
            handleEmpleadoChange("persona_contacto", e.target.value)
          }
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
          onChange={(e) =>
            handleEmpleadoChange("telefono_contacto", e.target.value)
          }
        />
      </div>

      {/* Foto */}
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
{/* TAB: LABORALES */}
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

      {/* Departamento */}
      <div>
        <span className="block mb-1 text-white/80">Departamento</span>
        <SelectSJ
          value={empleado.departamento_id || ""}
          onChange={(v) =>
            handleEmpleadoChange("departamento_id", Number(v))
          }
          options={[
            { value: "", label: "Sin departamento" },
            ...departamentos.map((d) => ({
              value: d.id,
              label: d.nombre,
            })),
          ]}
        />
      </div>

      {/* Sección */}
      <div>
        <span className="block mb-1 text-white/80">Sección</span>
        <SelectSJ
          value={empleado.seccion_id || ""}
          onChange={(v) =>
            handleEmpleadoChange("seccion_id", Number(v))
          }
          options={[
            { value: "", label: "Sin sección" },
            ...secciones.map((s) => ({
              value: s.id,
              label: s.nombre,
            })),
          ]}
        />
      </div>

      {/* Cargo */}
      <div>
        <span className="block mb-1 text-white/80">Cargo</span>
        <SelectSJ
          value={empleado.cargo_id || ""}
          onChange={(v) =>
            handleEmpleadoChange("cargo_id", Number(v))
          }
          options={[
            { value: "", label: "Sin cargo" },
            ...cargos.map((c) => ({
              value: c.id,
              label: c.nombre,
            })),
          ]}
        />
      </div>

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

{/* TAB: SEGURIDAD */}
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

      {/* Usuario */}
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

      {/* Password oculto */}
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
{/* ESTADO DEL EMPLEADO */}
<div className="mt-4">
  <span className="block mb-1 text-white/80">Estado actual</span>

  {empleado.activo ? (
    <span className="text-green-400 font-semibold">Activo</span>
  ) : (
    <span className="text-red-400 font-semibold">Bloqueado</span>
  )}
</div>

{/* BOTONES BLOQUEAR / DESBLOQUEAR */}
<div className="flex gap-4 mt-4">
  {empleado.activo ? (
    <button
      className="
        px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700
        text-white shadow-lg transition active:scale-[0.97]
      "
      onClick={async () => {
        await axios.post(
          `${API_BASE}/seguridad/asignar/empleado/${empleado.id}/bloquear`
        );

        const res = await obtenerFichaCompleta(empleado.id);
        const d = res.data;

        setData(d);
        setEmpleado(d.empleado || {});
        mostrarToast("ok", "Empleado bloqueado");
      }}
    >
      Bloquear empleado
    </button>
  ) : (
    <button
      className="
        px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700
        text-white shadow-lg transition active:scale-[0.97]
      "
      onClick={async () => {
        await axios.post(
          `${API_BASE}/seguridad/asignar/empleado/${empleado.id}/desbloquear`
        );

        const res = await obtenerFichaCompleta(empleado.id);
        const d = res.data;

        setData(d);
        setEmpleado(d.empleado || {});
        mostrarToast("ok", "Empleado desbloqueado");
      }}
    >
      Desbloquear empleado
    </button>
  )}
</div>

{/* ROL DEL EMPLEADO */}
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

  <SelectSJ
    value={empleado?.rol?.id || ""}
    onChange={(v) => {
      const id = Number(v);
      const rolObj = roles.find((r) => r.id === id) || null;
      handleEmpleadoChange("rol", rolObj);
    }}
    options={[
      { value: "", label: "Sin rol" },
      ...roles.map((r) => ({
        value: r.id,
        label: r.nombre,
      })),
    ]}
  />

  <div className="flex items-center gap-4 text-sm mt-4">
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

{/* RESET PASSWORD */}
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
{/* TABS SEGURIDAD */}
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

{/* MÓDULOS VISIBLES */}
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
      {MODULOS_SJ2026.map((mod) => (
        <label key={mod} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={modulos.includes(mod)}
            onChange={(e) => {
              if (e.target.checked) {
                setModulos([...modulos, mod]);
              } else {
                setModulos(modulos.filter((m) => m !== mod));
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

{/* PERMISOS POR MÓDULO */}
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
          {PERMISOS_SJ2026.map((perm) => (
            <label key={perm} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={permisos[mod]?.includes(perm)}
                onChange={(e) => {
                  const actual = permisos[mod] || [];
                  let nuevo;

                  if (e.target.checked) {
                    nuevo = [...actual, perm];
                  } else {
                    nuevo = actual.filter((p) => p !== perm);
                  }

                  setPermisos({
                    ...permisos,
                    [mod]: nuevo,
                  });
                }}
              />
              {perm}
            </label>
          ))}
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
{/* TAB: AUDITORÍA */}
{!loading && tab === "auditoria" && (
  <section
    className="
      bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
      p-6 shadow-xl space-y-4
    "
  >
    <h3 className="text-lg font-semibold drop-shadow mb-3">
      Auditoría del empleado
    </h3>

    {/* Sin registros */}
    {(!auditoria || auditoria.length === 0) && (
      <p className="text-white/70 text-sm">
        No hay registros de auditoría para este empleado.
      </p>
    )}

    {/* Lista de auditoría */}
    {auditoria && auditoria.length > 0 && (
      <ul className="list-disc ml-5 text-sm text-white/90 space-y-1">
        {auditoria.map((a) => (
          <li key={a.id}>
            {new Date(a.fecha).toLocaleString("es-ES")} —{" "}
            <strong className="text-white">{a.modulo}</strong>{" "}
            [{a.accion}] — {a.descripcion}
          </li>
        ))}
      </ul>
    )}
  </section>
)}

</div> {/* cierre scroll interno */}

</div> {/* cierre modal */}

</div> {/* cierre overlay */}

</>
);
}
