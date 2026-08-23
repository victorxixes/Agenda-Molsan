import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function EstadoEmpleado({ empleadoId }) {
  const [empleado, setEmpleado] = useState(null);

  // Cargar empleado
  useEffect(() => {
    axios.get(`/empleados/${empleadoId}`).then((res) => {
      setEmpleado(res.data);
    });
  }, [empleadoId]);

  // Cambiar estado (activo / inactivo)
  const toggleEstado = () => {
    const nuevoEstado = !empleado.activo;

    axios
      .put(`/empleados/${empleadoId}`, {
        activo: nuevoEstado
      })
      .then((res) => {
        setEmpleado(res.data);
      })
      .catch(() => alert("Error al cambiar estado"));
  };

  if (!empleado) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Estado del empleado</h2>

      <p className="mb-4">
        Estado actual:{" "}
        <span className={empleado.activo ? "text-green-600" : "text-red-600"}>
          {empleado.activo ? "Activo" : "Inactivo"}
        </span>
      </p>

      <button
        onClick={toggleEstado}
        className={`px-4 py-2 rounded text-white ${
          empleado.activo ? "bg-red-600" : "bg-green-600"
        }`}
      >
        {empleado.activo ? "Desactivar empleado" : "Activar empleado"}
      </button>
    </div>
  );
}
