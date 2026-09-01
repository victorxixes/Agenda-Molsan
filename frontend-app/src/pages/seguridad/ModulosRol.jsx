import { useEffect, useState } from "react";
import { useSeguridadStore } from "../../store/seguridadStore";
import { useParams } from "react-router-dom";

export default function ModulosRol() {
  const { rolActual, cargarRol, actualizarModulosRol } = useSeguridadStore();
  const { id } = useParams();

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

  const [modulos, setModulos] = useState([]);

  useEffect(() => {
    cargarRol(id);
  }, [id]);

  useEffect(() => {
    if (rolActual) {
      setModulos(rolActual.modulos_visibles_list || []);
    }
  }, [rolActual]);

  const toggle = (m) => {
    let nuevos = [...modulos];
    if (nuevos.includes(m)) {
      nuevos = nuevos.filter(x => x !== m);
    } else {
      nuevos.push(m);
    }
    setModulos(nuevos);
  };

  const guardar = async () => {
    await actualizarModulosRol(id, modulos);
    alert("Módulos actualizados");
  };

  if (!rolActual) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Módulos del rol</h2>

      <div className="grid grid-cols-2 gap-3">
        {MODULOS.map((m) => (
          <label key={m} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={modulos.includes(m)}
              onChange={() => toggle(m)}
            />
            {m}
          </label>
        ))}
      </div>

      <button
        onClick={guardar}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar
      </button>
    </div>
  );
}
