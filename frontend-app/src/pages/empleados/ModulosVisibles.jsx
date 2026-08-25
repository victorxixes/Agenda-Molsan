import { useEffect, useState } from "react";
import { useEmpleadosStore } from "../../store/empleadosStore";

export default function ModulosVisibles({ empleadoId }) {
  const {
    empleadoActual,
    cargarEmpleado,
    guardarModulos,
  } = useEmpleadosStore();

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

  const [modulosVisibles, setModulosVisibles] = useState([]);

  // Cargar empleado
  useEffect(() => {
    cargarEmpleado(empleadoId);
  }, [empleadoId]);

  // Cuando llega el empleado → rellenamos estado
  useEffect(() => {
    if (empleadoActual) {
      setModulosVisibles(empleadoActual.modulos_visibles || []);
    }
  }, [empleadoActual]);

  // Toggle módulo visible
  const toggleModulo = (modulo) => {
    let nuevos = [...modulosVisibles];

    if (nuevos.includes(modulo)) {
      nuevos = nuevos.filter((m) => m !== modulo);
    } else {
      nuevos.push(modulo);
    }

    setModulosVisibles(nuevos);
  };

  // Guardar cambios
  const guardarCambios = async () => {
    await guardarModulos(empleadoId, modulosVisibles);
    await cargarEmpleado(empleadoId);
    alert("Módulos visibles actualizados correctamente");
  };

  if (!empleadoActual) return <div className="p-6">Cargando módulos...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">Módulos visibles</h2>

      <div className="grid grid-cols-2 gap-3">
        {MODULOS.map((modulo) => (
          <label key={modulo} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={modulosVisibles.includes(modulo)}
              onChange={() => toggleModulo(modulo)}
            />
            {modulo}
          </label>
        ))}
      </div>

      <button
        onClick={guardarCambios}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar cambios
      </button>
    </div>
  );
}
