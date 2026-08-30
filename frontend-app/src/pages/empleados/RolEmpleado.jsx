import { useEffect, useState } from "react";
import { useEmpleadosStore } from "../../store/empleadosStore";
import { useSeguridadStore } from "../../store/seguridadStore";

export default function RolEmpleado({ empleadoId }) {
  const {
    empleadoActual,
    cargarEmpleado,
    actualizarEmpleado,
  } = useEmpleadosStore();

  const {
    roles,
    cargarRoles,
  } = useSeguridadStore();

  const [rolId, setRolId] = useState("");
  const [editando, setEditando] = useState(false);

  // Cargar empleado + roles SOLO una vez
  useEffect(() => {
    cargarEmpleado(empleadoId);
    cargarRoles();
  }, [empleadoId]);

  // Cuando llega el empleado → rellenamos estado (solo si no está editando)
  useEffect(() => {
    if (empleadoActual && !editando) {
      setRolId(empleadoActual.rol_id || "");
    }
  }, [empleadoActual]);

  const guardarRol = async () => {
    await actualizarEmpleado(empleadoId, { rol_id: Number(rolId) });

    // ❌ Ya NO llamamos a cargarEmpleado
    // El store + realtime ya actualizan automáticamente

    alert("Rol actualizado correctamente");
    setEditando(false);
  };

  if (!empleadoActual) return <div className="p-6">Cargando rol...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">Rol del empleado</h2>

      <div className="space-y-4">
        <label className="font-semibold">Rol asignado</label>

        <select
          className="border rounded px-2 py-1 w-full"
          value={rolId}
          onChange={(e) => {
            setEditando(true);
            setRolId(e.target.value);
          }}
        >
          <option value="">Seleccionar rol</option>
         {(roles || []).map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </select>

        <button
          onClick={guardarRol}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Guardar rol
        </button>
      </div>
    </div>
  );
}
