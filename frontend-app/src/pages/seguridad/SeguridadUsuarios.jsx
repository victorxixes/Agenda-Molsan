// frontend-app/src/panel/SeguridadUsuario.jsx
import { useEffect, useState, useMemo } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";
import EmpleadosListado from "../empleados/EmpleadosListado"; // ajusta la ruta si es distinta
import { API_BASE } from "../api/config";

export default function SeguridadUsuario() {
  const {
    roles,
    permisos,
    empleados,
    ficha,
    auditoria,
    logs,
    loading,
    cargarTodo,
    cargarFicha,
    asignarRol,
    asignarPermisos,
    asignarModulos,
    resetPassword,
    bloquear,
    desbloquear
  } = useSeguridad();

  const [empleadoIdSeleccionado, setEmpleadoIdSeleccionado] = useState(null);

  // Carga inicial de todo el módulo de seguridad
  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  // Cuando cambia el empleado seleccionado, cargamos su ficha completa
  useEffect(() => {
    if (empleadoIdSeleccionado != null) {
      cargarFicha(empleadoIdSeleccionado);
    }
  }, [empleadoIdSeleccionado, cargarFicha]);

  // Blindar ficha: siempre objeto o null, nunca se renderiza directamente
  const fichaSegura = useMemo(() => {
    if (!ficha || typeof ficha !== "object") return null;
    return ficha;
  }, [ficha]);

  // Buscar el empleado básico en la lista (para foto, nombre, etc.)
  const empleadoBasico = useMemo(() => {
    if (!empleadoIdSeleccionado || !Array.isArray(empleados)) return null;
    return empleados.find((e) => e.id === empleadoIdSeleccionado) || null;
  }, [empleadoIdSeleccionado, empleados]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Columna izquierda: listado de empleados */}
      <div className="lg:col-span-1">
        <EmpleadosListado
          onSeleccionar={(id) => {
            // ⭐ Nunca pasamos el objeto empleado como hijo, solo el id
            setEmpleadoIdSeleccionado(id);
          }}
        />
      </div>

      {/* Columna derecha: ficha de seguridad */}
      <div className="lg:col-span-2 space-y-6">
        {/* Cabecera de ficha */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">
          {loading && (
            <div className="text-sm text-white/60 mb-3">
              Cargando seguridad del usuario…
            </div>
          )}

          {empleadoBasico ? (
            <div className="flex items-center gap-4">
              <img
                src={
                  empleadoBasico.foto
                    ? `${API_BASE}${empleadoBasico.foto}`
                    : "/no-foto.png"
                }
                alt="foto"
                className="w-16 h-16 rounded-full object-cover border border-white/20 shadow-md"
              />

              <div>
                <div className="font-semibold text-white text-lg drop-shadow">
                  {empleadoBasico.nombre} {empleadoBasico.apellidos}
                </div>
                <div className="text-xs text-white/70">
                  ID: {empleadoBasico.id}
                </div>
                <div className="text-xs text-white/70 mt-1">
                  {empleadoBasico.departamento_nombre || "-"} ·{" "}
                  {empleadoBasico.seccion_nombre || "-"} ·{" "}
                  {empleadoBasico.cargo_nombre || "-"}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-white/70">
              Selecciona un empleado en la columna izquierda para ver su ficha
              de seguridad.
            </div>
          )}
        </div>

        {/* Ficha completa de seguridad */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
          {fichaSegura ? (
            <>
              <h2 className="text-white font-semibold text-lg">
                Ficha de seguridad
              </h2>

              {/* Datos básicos blindados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-white/80">
                <div>
                  <strong>Teléfono:</strong>{" "}
                  {fichaSegura.telefono || empleadoBasico?.telefono || "-"}
                </div>
                <div>
                  <strong>Email empresa:</strong>{" "}
                  {fichaSegura.email_empresa ||
                    empleadoBasico?.email_empresa ||
                    "-"}
                </div>
                <div>
                  <strong>Extensión:</strong>{" "}
                  {fichaSegura.extension || empleadoBasico?.extension || "-"}
                </div>
                <div>
                  <strong>Estado:</strong>{" "}
                  {fichaSegura.activo ?? empleadoBasico?.activo
                    ? "Activo"
                    : "Inactivo"}
                </div>
              </div>

              {/* Roles y permisos */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-white font-semibold text-sm mb-2">
                    Roles asignados
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(fichaSegura.roles)
                      ? fichaSegura.roles
                      : []
                    ).map((rol) => (
                      <span
                        key={rol.id ?? rol.nombre}
                        className="px-2 py-1 bg-blue-500/20 text-blue-100 border border-blue-400 rounded-xl text-xs"
                      >
                        {rol.nombre || "Rol"}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-sm mb-2">
                    Permisos asignados
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(fichaSegura.permisos)
                      ? fichaSegura.permisos
                      : []
                    ).map((perm) => (
                      <span
                        key={perm.id ?? perm.codigo ?? perm.nombre}
                        className="px-2 py-1 bg-purple-500/20 text-purple-100 border border-purple-400 rounded-xl text-xs"
                      >
                        {perm.nombre || perm.codigo || "Permiso"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Acciones de seguridad (ejemplo básico, sin lógica de UI compleja) */}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="px-3 py-2 bg-red-600 text-white rounded-xl text-xs hover:bg-red-700 disabled:opacity-40"
                  disabled={!empleadoIdSeleccionado}
                  onClick={() =>
                    empleadoIdSeleccionado && bloquear(empleadoIdSeleccionado)
                  }
                >
                  Bloquear empleado
                </button>

                <button
                  type="button"
                  className="px-3 py-2 bg-green-600 text-white rounded-xl text-xs hover:bg-green-700 disabled:opacity-40"
                  disabled={!empleadoIdSeleccionado}
                  onClick={() =>
                    empleadoIdSeleccionado &&
                    desbloquear(empleadoIdSeleccionado)
                  }
                >
                  Desbloquear empleado
                </button>
              </div>
            </>
          ) : (
            <div className="text-sm text-white/70">
              No hay ficha de seguridad cargada todavía.
            </div>
          )}
        </div>

        {/* Auditoría y logs (solo lectura, sin renderizar objetos crudos) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
            <h3 className="text-white font-semibold text-sm mb-2">
              Auditoría
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto text-xs text-white/80">
              {(Array.isArray(auditoria) ? auditoria : []).map((item) => (
                <div
                  key={item.id ?? `${item.fecha}-${item.accion}-${item.usuario}`}
                  className="border border-white/10 rounded-xl px-3 py-2"
                >
                  <div className="font-semibold">
                    {item.accion || "Acción"}
                  </div>
                  <div>{item.descripcion || "-"}</div>
                  <div className="text-white/50">
                    {item.fecha || ""} · {item.usuario || ""}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
            <h3 className="text-white font-semibold text-sm mb-2">Logs</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto text-xs text-white/80">
              {(Array.isArray(logs) ? logs : []).map((log) => (
                <div
                  key={log.id ?? `${log.fecha}-${log.tipo}-${log.mensaje}`}
                  className="border border-white/10 rounded-xl px-3 py-2"
                >
                  <div className="font-semibold">
                    {log.tipo || "Log"}
                  </div>
                  <div>{log.mensaje || "-"}</div>
                  <div className="text-white/50">
                    {log.fecha || ""} · {log.origen || ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
