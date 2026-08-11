import { useEffect, useState } from "react";
import axios from "axios";

const ROLES = ["Administrador", "Gestor", "Apoderado", "Usuario básico"];

export default function RolEmpleado({ empleadoId }) {
  const [empleado, setEmpleado] = useState(null);
  const [rol, setRol] = useState("");
  const API = "https://agenda-intranet-backend.onrender.com";

  useEffect(() => {
    axios.get(`${API}/empleados/${empleadoId}`).then((res) => {
      setEmpleado(res.data);
      setRol(res.data.rol || "");
    });
  }, [empleadoId]);

  const guardarRol = () => {
    axios
      .put(`${API}/empleados/${empleadoId}`, { ...empleado, rol })
      .then(() => alert("Rol actualizado"))
      .catch(() => alert("Error al actualizar rol"));
  };

  if (!empleado) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Rol del empleado</h2>
      <p className="mb-4">
        Selecciona el rol que tendrá este empleado dentro del sistema.
      </p>

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
            {r}
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
