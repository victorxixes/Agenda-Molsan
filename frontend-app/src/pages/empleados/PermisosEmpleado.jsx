import { useEffect, useState } from "react";
import axios from "axios";

export default function PermisosEmpleado({ empleadoId }) {
  const API = "https://agenda-intranet-b.onrender.com";

  // 🔥 Módulos disponibles
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

  // 🔥 Permisos disponibles
  const PERMISOS = ["ver", "crear", "editar", "borrar"];

  const [modulosVisibles, setModulosVisibles] = useState([]);
  const [permisosModulo, setPermisosModulo] = useState({});

  useEffect(() => {
    axios.get(`${API}/empleados/${empleadoId}`).then((res) => {
      setModulosVisibles(res.data.modulos_visibles || []);
      setPermisosModulo(res.data.permisos_modulo || {});
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

  const togglePermiso = (modulo, permiso) => {
    const actuales = permisosModulo[modulo] || [];
    let nuevos = [...actuales];

    if (nuevos.includes(permiso)) {
      nuevos = nuevos.filter((p) => p !== permiso);
    } else {
      nuevos.push(permiso);
    }

    setPermisosModulo({
      ...permisosModulo,
      [modulo]: nuevos,
    });
  };

  const guardarCambios = () => {
    axios
      .put(`${API}/empleados/${empleadoId}/permisos`, {
        modulos_visibles: modulosVisibles,
        permisos_modulo: permisosModulo,
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
