import { useEffect, useState } from "react";
import axios from "../api/axios";

const ROLES = ["admin", "gestor", "apoderado", "usuario"];

export default function RolEmpleado({ empleadoId }) {
  const [empleado, setEmpleado] = useState(null);
  const [rol, setRol] = useState("");

  // Cargar empleado
  useEffect(() => {
    axios.get(`/empleados/${empleadoId}`).then((res) => {
      setEmpleado(res.data);

      // Si ya tiene rol guardado en permisos_modulo
      const rolActual = res.data.permisos_modulo?.rol || "";
      setRol(rolActual);
    });
  }, [empleadoId]);

  // Guardar rol dentro de permisos_modulo
  const guardarRol = () => {
    axios
      .put(`/empleados/${empleadoId}/permisos-detalle`, {
        permisos: {
          ...empleado.permisos_modulo,
          rol: rol,
        },
      })
      .then(() => alert("Rol actualizado correctamente"))
      .catch(() => alert("Error al actualizar rol"));
  };

  if (!empleado) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Rol del empleado</h2>
      <p className="mb-4">Selecciona el rol que tendrá este empleado dentro del sistema.</p>

      <div className="space-y-2 mb-4">
        {ROLES.map((r) => (
          <label key={r} className="flex items-center gap-2">
            <input
              type="radio"
              name="rol"
              value={r}
              checked={rol === r}
              onChange={() => setRol(r)}
            />
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </label>
        ))}
      </div>

      <button
        onClick={guardarRol}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Guardar rol
      </button>
    </div>
  );
}
