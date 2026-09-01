import { useEffect, useState } from "react";
import { useSeguridadStore } from "../../store/seguridadStore";
import { useParams } from "react-router-dom";

export default function PermisosRol() {
  const { rolActual, cargarRol, actualizarPermisosRol } = useSeguridadStore();
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

  const PERMISOS = ["ver", "crear", "editar", "eliminar"];

  const [permisos, setPermisos] = useState({});

  useEffect(() => {
    cargarRol(id);
  }, [id]);

  useEffect(() => {
    if (rolActual) {
      setPermisos(rolActual.permisos_modulo_dict || {});
    }
  }, [rolActual]);

  const toggle = (modulo, permiso) => {
    const nuevos = { ...permisos };
    const lista = nuevos[modulo] || [];

    if (lista.includes(permiso)) {
      nuevos[modulo] = lista.filter(p => p !== permiso);
    } else {
      nuevos[modulo] = [...lista, permiso];
    }

    setPermisos(nuevos);
  };

  const guardar = async () => {
    await actualizarPermisosRol(id, permisos);
    alert("Permisos actualizados");
  };

  if (!rolActual) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Permisos del rol</h2>

      {MODULOS.map((modulo) => (
        <div key={modulo} className="border p-4 rounded">
          <h3 className="font-semibold mb-2">{modulo}</h3>

          <div className="grid grid-cols-2 gap-2">
            {PERMISOS.map((permiso) => (
              <label key={permiso} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(permisos[modulo] || []).includes(permiso)}
                  onChange={() => toggle(modulo, permiso)}
                />
                {permiso}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={guardar}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar
      </button>
    </div>
  );
}
