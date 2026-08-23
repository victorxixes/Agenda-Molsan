import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function ModulosVisibles({ empleadoId }) {
  const MODULOS = [
    "dashboard",
    "agenda",
    "empleados",
    "ctn",
    "documentos",
    "intranet",
    "mensajes",
    "seguridad"
  ];

  const [modulosVisibles, setModulosVisibles] = useState([]);

  // Cargar módulos visibles del empleado
  useEffect(() => {
    axios.get(`/empleados/${empleadoId}`).then((res) => {
      setModulosVisibles(res.data.modulos_visibles || []);
    });
  }, [empleadoId]);

  // Alternar módulo
  const toggleModulo = (modulo) => {
    let nuevos = [...modulosVisibles];

    if (nuevos.includes(modulo)) {
      nuevos = nuevos.filter((m) => m !== modulo);
    } else {
      nuevos.push(modulo);
    }

    setModulosVisibles(nuevos);
  };

  // Guardar cambios (endpoint correcto del backend)
  const guardarCambios = () => {
    axios
      .put(`/empleados/${empleadoId}/permisos`, {
        modulos: modulosVisibles
      })
      .then(() => alert("Módulos visibles actualizados"))
      .catch(() => alert("Error al guardar módulos"));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Módulos visibles</h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
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
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Guardar cambios
      </button>
    </div>
  );
}
