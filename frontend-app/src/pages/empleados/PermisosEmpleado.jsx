import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function PermisosEmpleado({ empleadoId }) {
  // Módulos disponibles
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

  // Permisos disponibles
  const PERMISOS = ["ver", "crear", "editar", "borrar"];

  const [modulosVisibles, setModulosVisibles] = useState([]);
  const [permisosModulo, setPermisosModulo] = useState({});

  // Cargar datos del empleado
  useEffect(() => {
    axios.get(`/empleados/${empleadoId}`).then((res) => {
      setModulosVisibles(res.data.modulos_visibles || []);
      setPermisosModulo(res.data.permisos_modulo || {});
    });
  }, [empleadoId]);

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

  // Toggle permiso por módulo
  const togglePermiso = (modulo, permiso) => {
    const actuales = permisosModulo[modulo] || [];
    let nuevos = actuales.includes(permiso)
      ? actuales.filter((p) => p !== permiso)
      : [...actuales, permiso];

    setPermisosModulo({
      ...permisosModulo,
      [modulo]: nuevos,
    });
  };

  // Guardar cambios (endpoint correcto del backend)
  const guardarCambios = () => {
    axios
      .put(`/empleados/${empleadoId}/permisos-detalle`, {
        permisos: permisosModulo
      })
      .then(() => alert("Permisos actualizados correctamente"))
      .catch(() => alert("Error al guardar permisos"));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Permisos por módulo</h2>

      {/* MÓDULOS VISIBLES */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Módulos visibles</h3>

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
      </div>

      {/* PERMISOS POR MÓDULO */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Permisos por módulo</h3>

        {modulosVisibles.length === 0 && (
          <p className="text-gray-500">Selecciona módulos primero.</p>
        )}

        {modulosVisibles.map((modulo) => (
          <div key={modulo} className="mb-4 border p-3 rounded-lg">
            <h4 className="font-medium mb-2">{modulo}</h4>

            <div className="flex gap-4 flex-wrap">
              {PERMISOS.map((permiso) => (
                <label key={permiso} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={permisosModulo[modulo]?.includes(permiso) || false}
                    onChange={() => togglePermiso(modulo, permiso)}
                  />
                  {permiso}
                </label>
              ))}
            </div>
          </div>
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
