import { useEffect, useState } from "react";
import { useEmpleadosStore } from "../../store/empleadosStore";

export default function PermisosEmpleado({ empleadoId }) {
  const {
    empleadoActual,
    cargarEmpleado,
    guardarPermisos,
  } = useEmpleadosStore();

  const [permisos, setPermisos] = useState({});
  const [editando, setEditando] = useState(false);

  // Cargar empleado SOLO una vez
  useEffect(() => {
    cargarEmpleado(empleadoId);
  }, [empleadoId]);

  // Actualizar permisos cuando llega el empleado (solo si no está editando)
  useEffect(() => {
    if (empleadoActual && !editando) {
      setPermisos(empleadoActual.permisos_modulo || {});
    }
  }, [empleadoActual]);

  const togglePermiso = (modulo, permiso) => {
    setEditando(true);

    const nuevos = { ...permisos };
    const lista = nuevos[modulo] || [];

    if (lista.includes(permiso)) {
      nuevos[modulo] = lista.filter((p) => p !== permiso);
    } else {
      nuevos[modulo] = [...lista, permiso];
    }

    setPermisos(nuevos);
  };

  const guardarCambios = async () => {
    await guardarPermisos(empleadoId, permisos);

    // ❌ NO recargar empleado
    // El store + realtime ya actualizan automáticamente

    alert("Permisos actualizados correctamente");
    setEditando(false);
  };

  if (!empleadoActual) return <div className="p-6">Cargando permisos...</div>;

  const MODULOS = [
    "dashboard",
    "agenda",
    "empleados",
    "ctn",
    "documentos",
    "intranet",
    "mensajes",
    "seguridad",
  ];

  const PERMISOS = ["ver", "crear", "editar", "eliminar"];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">Permisos del empleado</h2>

      <div className="space-y-6">
        {MODULOS.map((modulo) => (
          <div key={modulo} className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{modulo}</h3>

            <div className="grid grid-cols-2 gap-2">
              {PERMISOS.map((permiso) => (
                <label key={permiso} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(permisos[modulo] || []).includes(permiso)}
                    onChange={() => togglePermiso(modulo, permiso)}
                  />
                  {permiso}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={guardarCambios}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar permisos
      </button>
    </div>
  );
}
