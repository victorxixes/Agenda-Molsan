import { useEffect, useState, useCallback, useMemo } from "react";
import { API_BASE } from "../../api/config";
import {
  obtenerFichaCompleta,
  actualizarModulosVisibles,
  actualizarPermisosModulo,
  subirFotoEmpleado,
} from "../../api/empleados";

// Sanitizador SJ‑2026
const safe = (v) => {
  if (v === null || v === undefined) return "-";
  if (typeof v === "object") return "-";
  if (typeof v === "boolean") return v ? "Sí" : "No";
  return String(v);
};

export default function EmpleadoFicha({ empleadoId }) {
  const idNum = Number(empleadoId);

  const [data, setData] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [permisos, setPermisos] = useState({});
  const [rolId, setRolId] = useState(null);

  // Cargar ficha completa
  useEffect(() => {
    if (!Number.isFinite(idNum)) return;

    obtenerFichaCompleta(idNum).then((res) => {
      const d = res.data || {};

      setData(d);
      setModulos(Array.isArray(d.modulos_visibles) ? d.modulos_visibles : []);
      setPermisos(typeof d.permisos_modulo === "object" ? d.permisos_modulo : {});
      setRolId(d.empleado?.rol?.id ?? null);
    });
  }, [idNum]);

  if (!Number.isFinite(idNum))
    return <div className="text-white/70">Selecciona un empleado válido.</div>;

  if (!data)
    return <div className="text-white/70 animate-pulse">Cargando ficha…</div>;

  const empleado = data?.empleado || {};
  const rol = empleado?.rol || {};

  // SUBIR FOTO
  const handleFoto = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      await subirFotoEmpleado(idNum, file);

      const res = await obtenerFichaCompleta(idNum);
      setData(res.data);
    },
    [idNum]
  );

  // GUARDAR MÓDULOS
  const guardarModulos = useCallback(async () => {
    await actualizarModulosVisibles(idNum, modulos);
    alert("Módulos visibles guardados");
  }, [idNum, modulos]);

  // GUARDAR PERMISOS
  const guardarPermisos = useCallback(async () => {
    await actualizarPermisosModulo(idNum, permisos);
    alert("Permisos guardados");
  }, [idNum, permisos]);

  // GUARDAR ROL
  const guardarRol = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/seguridad/asignar/empleado/${idNum}/rol/${rolId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      alert("Rol actualizado correctamente");

      const res = await obtenerFichaCompleta(idNum);
      setData(res.data);
      setRolId(res.data.empleado?.rol?.id || null);
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el rol");
    }
  }, [idNum, rolId]);

  const fotoUrl = useMemo(() => {
    const f = empleado.foto;
    return typeof f === "string" && f !== "-" ? `${API_BASE}${f}` : null;
  }, [empleado.foto]);

  return (
    <div className="space-y-8 text-white animate-fade-in">

      {/* DATOS BÁSICOS */}
      <section className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 drop-shadow">Datos básicos</h2>

        <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
          <div><strong>Nombre:</strong> {safe(empleado.nombre)}</div>
          <div><strong>Apellidos:</strong> {safe(empleado.apellidos)}</div>
          <div><strong>DNI:</strong> {safe(empleado.dni)}</div>
          <div><strong>Teléfono:</strong> {safe(empleado.telefono)}</div>
          <div><strong>Email personal:</strong> {safe(empleado.email_personal)}</div>
          <div><strong>Email empresa:</strong> {safe(empleado.email_empresa)}</div>
          <div><strong>Usuario:</strong> {safe(empleado.usuario)}</div>
          <div><strong>Rol actual:</strong> {safe(rol.nombre)}</div>
        </div>

        <div className="mt-6 flex items-center gap-6">
          {fotoUrl && (
            <img
              src={fotoUrl}
              alt="Foto empleado"
              className="w-28 h-28 rounded-full object-cover border border-white/20 shadow-xl"
            />
          )}

          <label className="text-sm text-white/80">
            Subir nueva foto:
            <input
              type="file"
              className="block mt-2 text-white"
              onChange={handleFoto}
            />
          </label>
        </div>
      </section>

      {/* ROL */}
      <section className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 drop-shadow">Rol del empleado</h2>

        <div className="flex items-center gap-4">
          <select
            className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-blue-400"
            value={rolId || ""}
            onChange={(e) => setRolId(Number(e.target.value))}
          >
            <option value="">Selecciona rol</option>
            <option value={1}>admin</option>
            <option value={2}>tecnico</option>
            <option value={3}>usuario</option>
          </select>

          <button
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition active:scale-[0.97]"
            onClick={guardarRol}
          >
            Guardar rol
          </button>
        </div>
      </section>

            {/* BLOQUEAR / DESBLOQUEAR */}
      <section className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 drop-shadow">Estado del empleado</h2>

        {/* Estado visual */}
        <div className="text-sm mb-4">
          {empleado.activo ? (
            <span className="text-green-400 font-semibold">Activo</span>
          ) : (
            <span className="text-red-400 font-semibold">Bloqueado</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {empleado.activo ? (
            <button
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg transition active:scale-[0.97]"
              onClick={async () => {
                await fetch(`${API_BASE}/seguridad/asignar/empleado/${idNum}/bloquear`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                });

                const res = await obtenerFichaCompleta(idNum);
                setData(res.data);
              }}
            >
              Bloquear empleado
            </button>
          ) : (
            <button
              className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg transition active:scale-[0.97]"
              onClick={async () => {
                await fetch(`${API_BASE}/seguridad/asignar/empleado/${idNum}/desbloquear`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                });

                const res = await obtenerFichaCompleta(idNum);
                setData(res.data);
              }}
            >
              Desbloquear empleado
            </button>
          )}
        </div>
      </section>

      {/* MÓDULOS */}
      <section className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 drop-shadow">Módulos visibles</h2>

        <textarea
          className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-xs"
          rows={4}
          value={JSON.stringify(modulos, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              if (Array.isArray(parsed)) setModulos(parsed);
            } catch {}
          }}
        />

        <button
          className="mt-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition active:scale-[0.97]"
          onClick={guardarModulos}
        >
          Guardar módulos visibles
        </button>
      </section>

      {/* PERMISOS */}
      <section className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 drop-shadow">Permisos por módulo</h2>

        <textarea
          className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-xs"
          rows={6}
          value={JSON.stringify(permisos, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              if (typeof parsed === "object") setPermisos(parsed);
            } catch {}
          }}
        />

        <button
          className="mt-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition active:scale-[0.97]"
          onClick={guardarPermisos}
        >
          Guardar permisos
        </button>
      </section>
    </div>
  );
}
