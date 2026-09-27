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

const MODULOS_SJ2026 = [
  "dashboard","agenda","empleados","ctn","intranet","mensajes","noticias",
  "documentos","auditoria","logs","seguridad","utilidades","maestros",
  "realtime","herramientas","panel-tecnico","notificaciones","expedientes"
];

const PERMISOS_SJ2026 = ["ver","crear","editar","eliminar"];

export default function ModalEmpleado({ open, onClose, empleadoId }) {

  const [loading, setLoading] = useState(false);
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

        setEmpleado(d.empleado || {});
        setModulos(d.modulos_visibles || []);
        setPermisos(d.permisos_modulo || []);
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

  const handleEmpleadoChange = (campo, valor) => {
    setEmpleado(e => ({ ...e, [campo]: valor }));
  };

  if (!open) return null;
<>
  {toast && (
    <div className={`fixed top-4 right-4 px-4 py-2 rounded-xl shadow-xl text-white
      ${toast.tipo === "ok" ? "bg-green-600/40" : "bg-red-600/40"}`}>
      {toast.mensaje}
    </div>
  )}

  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-[900px] max-h-[90vh] overflow-hidden text-white">

      <div className="flex justify-between items-center px-6 py-4 border-b border-white/20">
        <h2 className="text-xl font-semibold">
          Ficha empleado {empleado.id} — {empleado.nombre} {empleado.apellidos}
        </h2>
        <button onClick={onClose} className="px-4 py-2 bg-white/10 rounded-xl">Cerrar</button>
      </div>

      <div className="px-6 pt-3 pb-2 border-b border-white/20 flex gap-3 text-sm">
        {["basicos","personales","laborales","seguridad","auditoria"].map(t => (
          <button key={t}
            className={`px-4 py-2 rounded-xl ${
              tab === t ? "bg-blue-600 text-white" : "bg-white/10 text-white/70"
            }`}
            onClick={() => setTab(t)}
          >
            {t === "basicos" && "Datos básicos"}
            {t === "personales" && "Datos personales"}
            {t === "laborales" && "Datos laborales"}
            {t === "seguridad" && "Seguridad"}
            {t === "auditoria" && "Auditoría"}
          </button>
        ))}
      </div>

      <div className="px-6 pb-6 pt-4 overflow-y-auto max-h-[75vh]">

        {!loading && tab === "basicos" && (
          <section className="bg-white/10 border border-white/20 rounded-2xl p-6 space-y-6">

            <h3 className="text-lg font-semibold">Datos básicos</h3>

            <div className="grid grid-cols-3 gap-4 text-sm">

              <div>
                <span className="block mb-1">Estado</span>
                <SelectSJ
                  value={empleado.estado ?? 1}
                  onChange={v => handleEmpleadoChange("estado", Number(v))}
                  options={[
                    { value: 1, label: "Activo" },
                    { value: 0, label: "Baja" }
                  ]}
                />
              </div>

              <div>
                <span className="block mb-1">Nombre</span>
                <input className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2"
                  value={empleado.nombre || ""}
                  onChange={e => handleEmpleadoChange("nombre", e.target.value)}
                />
              </div>

              <div>
                <span className="block mb-1">Teléfono</span>
                <input className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2"
                  value={empleado.telefono || ""}
                  onChange={e => handleEmpleadoChange("telefono", e.target.value)}
                />
              </div>

            </div>

            <button className="px-4 py-2 bg-blue-600 rounded-xl"
              onClick={() => editarEmpleado(empleado.id, empleado)}>
              Guardar datos básicos
            </button>

          </section>
        )}

        {!loading && tab === "personales" && (
          <section className="bg-white/10 border border-white/20 rounded-2xl p-6 space-y-6">

            <h3 className="text-lg font-semibold">Datos personales</h3>

            <div className="grid grid-cols-3 gap-4 text-sm">

              <div>
                <span className="block mb-1">Nombre</span>
                <input className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2"
                  value={empleado.nombre || ""}
                  onChange={e => handleEmpleadoChange("nombre", e.target.value)}
                />
              </div>

              <div>
                <span className="block mb-1">Apellidos</span>
                <input className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2"
                  value={empleado.apellidos || ""}
                  onChange={e => handleEmpleadoChange("apellidos", e.target.value)}
                />
              </div>

              <div>
                <span className="block mb-1">DNI</span>
                <input className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2"
                  value={empleado.dni || ""}
                  onChange={e => handleEmpleadoChange("dni", e.target.value)}
                />
              </div>

            </div>

            <div className="col-span-2">
              <span className="block mb-1">Observaciones</span>
              <textarea
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2"
                rows={3}
                value={empleado.observaciones || ""}
                onChange={e => handleEmpleadoChange("observaciones", e.target.value)}
              />
            </div>

            <button className="px-4 py-2 bg-blue-600 rounded-xl"
              onClick={() => editarEmpleado(empleado.id, empleado)}>
              Guardar cambios
            </button>

          </section>
        )}
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

</section>
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
