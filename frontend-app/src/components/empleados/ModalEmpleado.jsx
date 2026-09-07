import { useEffect, useState } from "react";
import {
  obtenerFichaCompleta,
  editarEmpleado,
  actualizarModulosVisibles,
  actualizarPermisosModulo,
  subirFotoEmpleado,
} from "../../api/empleados";
import { API_BASE } from "../../api/config";

export default function ModalEmpleado({ open, onClose, empleadoId }) {
  const [tab, setTab] = useState("personales");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [empleado, setEmpleado] = useState({
    nombre: "",
    apellidos: "",
    dni: "",
    telefono: "",
    email_personal: "",
    email_empresa: "",
    usuario: "",
    cargo: "",
    departamento: "",
    fecha_alta: "",
    activo: true,
  });

  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [modulosVisibles, setModulosVisibles] = useState([]);
  const [permisosModulo, setPermisosModulo] = useState({});
  const [auditoria, setAuditoria] = useState([]);

  useEffect(() => {
    if (!open || !empleadoId) return;
    setLoading(true);
    obtenerFichaCompleta(empleadoId)
      .then((res) => {
        const d = res.data || {};
        setData(d);

        const e = d.empleado || {};
        setEmpleado({
          nombre: e.nombre ?? "",
          apellidos: e.apellidos ?? "",
          dni: e.dni ?? "",
          telefono: e.telefono ?? "",
          email_personal: e.email_personal ?? "",
          email_empresa: e.email_empresa ?? "",
          usuario: e.usuario ?? "",
          cargo: e.cargo ?? "",
          departamento: e.departamento ?? "",
          fecha_alta: e.fecha_alta ?? "",
          activo: e.activo ?? true,
        });

        setRoles(d.roles || []);
        setPermisos(d.permisos || []);
        setModulosVisibles(d.modulos_visibles || []);
        setPermisosModulo(d.permisos_modulo || {});
        setAuditoria(d.auditoria || []);
      })
      .finally(() => setLoading(false));
  }, [open, empleadoId]);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open || !empleadoId) return null;

  const handleEmpleadoChange = (campo, valor) =>
    setEmpleado((prev) => ({ ...prev, [campo]: valor }));

  const guardarDatosEmpleado = async () => {
    await editarEmpleado(empleadoId, empleado);
  };

  const guardarModulos = async () => {
    await actualizarModulosVisibles(empleadoId, modulosVisibles);
  };

  const guardarPermisosModulo = async () => {
    await actualizarPermisosModulo(empleadoId, permisosModulo);
  };

  const handleFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await subirFotoEmpleado(empleadoId, file);
    const res = await obtenerFichaCompleta(empleadoId);
    const d = res.data || {};
    setData(d);
  };

  const Tab = ({ id, label }) => (
    <button
      onClick={() => setTab(id)}
      className={`px-4 py-2 border-b-2 text-sm ${
        tab === id ? "border-blue-600 text-blue-600" : "border-transparent"
      }`}
    >
      {label}
    </button>
  );

  const empleadoRaw = data?.empleado || {};
  const rol = empleadoRaw?.rol || {};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-xl w-[1000px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">
            Ficha empleado #{empleadoId} — {empleadoRaw.nombre}{" "}
            {empleadoRaw.apellidos}
          </h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Cerrar
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-4 border-b">
          <Tab id="personales" label="Datos personales" />
          <Tab id="laborales" label="Datos laborales" />
          <Tab id="roles" label="Roles" />
          <Tab id="permisos" label="Permisos" />
          <Tab id="auditoria" label="Auditoría" />
          <Tab id="foto" label="Foto" />
          <Tab id="modulos" label="Módulos visibles" />
          <Tab id="permisos_modulo" label="Permisos por módulo" />
        </div>

        <div className="p-4 text-sm">
          {loading && <div>Cargando ficha...</div>}

          {!loading && tab === "personales" && (
            <div className="space-y-3">
              <h3 className="font-semibold mb-2">Datos personales</h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="border p-2 rounded"
                  placeholder="Nombre"
                  value={empleado.nombre}
                  onChange={(e) =>
                    handleEmpleadoChange("nombre", e.target.value)
                  }
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Apellidos"
                  value={empleado.apellidos}
                  onChange={(e) =>
                    handleEmpleadoChange("apellidos", e.target.value)
                  }
                />
                <input
                  className="border p-2 rounded"
                  placeholder="DNI"
                  value={empleado.dni}
                  onChange={(e) =>
                    handleEmpleadoChange("dni", e.target.value)
                  }
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Teléfono"
                  value={empleado.telefono}
                  onChange={(e) =>
                    handleEmpleadoChange("telefono", e.target.value)
                  }
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Email personal"
                  value={empleado.email_personal}
                  onChange={(e) =>
                    handleEmpleadoChange("email_personal", e.target.value)
                  }
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Email empresa"
                  value={empleado.email_empresa}
                  onChange={(e) =>
                    handleEmpleadoChange("email_empresa", e.target.value)
                  }
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Usuario"
                  value={empleado.usuario}
                  onChange={(e) =>
                    handleEmpleadoChange("usuario", e.target.value)
                  }
                />
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={empleado.activo}
                    onChange={(e) =>
                      handleEmpleadoChange("activo", e.target.checked)
                    }
                  />
                  Activo
                </label>
              </div>
              <button
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm"
                onClick={guardarDatosEmpleado}
              >
                Guardar datos personales
              </button>
            </div>
          )}

          {!loading && tab === "laborales" && (
            <div className="space-y-3">
              <h3 className="font-semibold mb-2">Datos laborales</h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="border p-2 rounded"
                  placeholder="Cargo"
                  value={empleado.cargo}
                  onChange={(e) =>
                    handleEmpleadoChange("cargo", e.target.value)
                  }
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Departamento"
                  value={empleado.departamento}
                  onChange={(e) =>
                    handleEmpleadoChange("departamento", e.target.value)
                  }
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Fecha alta"
                  value={empleado.fecha_alta}
                  onChange={(e) =>
                    handleEmpleadoChange("fecha_alta", e.target.value)
                  }
                />
              </div>
              <button
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm"
                onClick={guardarDatosEmpleado}
              >
                Guardar datos laborales
              </button>
            </div>
          )}

          {!loading && tab === "roles" && (
            <div className="space-y-3">
              <h3 className="font-semibold mb-2">Roles</h3>
              <p>
                <strong>Rol principal:</strong> {rol?.nombre || "Sin rol"}
              </p>
              <ul className="list-disc ml-6">
                {roles.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {!loading && tab === "permisos" && (
            <div className="space-y-3">
              <h3 className="font-semibold mb-2">Permisos</h3>
              <ul className="list-disc ml-6">
                {permisos.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {!loading && tab === "auditoria" && (
            <div className="space-y-3">
              <h3 className="font-semibold mb-2">Auditoría</h3>
              {auditoria.length === 0 && (
                <p className="text-gray-500 text-xs">
                  No hay registros de auditoría disponibles.
                </p>
              )}
              {auditoria.length > 0 && (
                <ul className="list-disc ml-6 text-xs">
                  {auditoria.map((a, idx) => (
                    <li key={idx}>
                      {a.fecha} — {a.descripcion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {!loading && tab === "foto" && (
            <div className="space-y-3">
              <h3 className="font-semibold mb-2">Foto</h3>
              <div className="flex items-center gap-4">
                {empleadoRaw.foto && (
                  <img
                    src={`${API_BASE}${empleadoRaw.foto}`}
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
            </div>
          )}

          {!loading && tab === "modulos" && (
            <div className="space-y-3">
              <h3 className="font-semibold mb-2">Módulos visibles</h3>
              <textarea
                className="w-full border rounded p-2 text-xs"
                rows={6}
                value={JSON.stringify(modulosVisibles, null, 2)}
                onChange={(e) => {
                  try {
                    setModulosVisibles(JSON.parse(e.target.value));
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
            </div>
          )}

          {!loading && tab === "permisos_modulo" && (
            <div className="space-y-3">
              <h3 className="font-semibold mb-2">Permisos por módulo</h3>
              <textarea
                className="w-full border rounded p-2 text-xs"
                rows={8}
                value={JSON.stringify(permisosModulo, null, 2)}
                onChange={(e) => {
                  try {
                    setPermisosModulo(JSON.parse(e.target.value));
                  } catch {
                    // ignorar
                  }
                }}
              />
              <button
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
                onClick={guardarPermisosModulo}
              >
                Guardar permisos por módulo
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0" onClick={onClose}></div>
    </div>
  );
}
