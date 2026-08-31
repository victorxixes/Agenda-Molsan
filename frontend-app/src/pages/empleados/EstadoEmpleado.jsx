import { useEffect } from "react";
import { useEmpleadosStore } from "../../store/empleadosStore";

export default function EstadoEmpleado({ empleadoId }) {
  const {
    empleadoActual,
    cargarEmpleado,
    toggleActivo,
  } = useEmpleadosStore();



  if (!empleadoActual) return <div className="p-6">Cargando estado...</div>;

  const e = empleadoActual;

  const cambiarEstado = async () => {
    await toggleActivo(e);
    await cargarEmpleado(empleadoId);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">Estado del empleado</h2>

      <p className="mb-4">
        Estado actual:{" "}
        <span className={e.activo ? "text-green-600" : "text-red-600"}>
          {e.activo ? "Activo" : "Inactivo"}
        </span>
      </p>

      <button
        onClick={cambiarEstado}
        className={`px-4 py-2 rounded text-white ${
          e.activo ? "bg-red-600" : "bg-green-600"
        }`}
      >
        {e.activo ? "Desactivar empleado" : "Activar empleado"}
      </button>
    </div>
  );
}
