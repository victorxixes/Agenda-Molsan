import { useEffect, useState } from "react";
import axios from "axios";

export default function ModulosVisibles({ empleadoId }) {
  const API = "https://agenda-intranet-b.onrender.com";

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

  useEffect(() => {
    axios.get(`${API}/empleados/${empleadoId}`).then((res) => {
      setModulosVisibles(res.data.modulos_visibles || []);
    });
  }, [empleadoId]);

  const toggleModulo = (modulo) => {
    let nuevos = [...modulosVisibles];
    if (nuevos.includes(modulo)) {
      nuevos = nuevos.filter((m) => m !== modulo);
    } else {
      nuevos.push(modulo);
    }
    setModulosVisibles(nuevos);
  };

  const guardarCambios = () => {
    axios
      .put(`${API}/empleados/${empleadoId}`, {
        modulos_visibles: modulosVisibles,
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
