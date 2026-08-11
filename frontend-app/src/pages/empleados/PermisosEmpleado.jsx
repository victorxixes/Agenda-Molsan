import { useEffect, useState } from "react";
import axios from "axios";

export default function PermisosEmpleado({ empleadoId }) {
  const [modulosDisponibles, setModulosDisponibles] = useState([]);
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);

  const [modulosVisibles, setModulosVisibles] = useState([]);
  const [permisosModulo, setPermisosModulo] = useState({});

  const API = "https://agenda-intranet-backend.onrender.com";

  // ---------------------------------------------------------
  // CARGAR MÓDULOS Y PERMISOS DISPONIBLES
  // ---------------------------------------------------------
  useEffect(() => {
    axios.get(`${API}/empleados/modulos`).then((res) => {
      setModulosDisponibles(res.data.modulos);
      setPermisosDisponibles(res.data.permisos);
    });

    axios.get(`${API}/empleados/${empleadoId}`).then((res) => {
      setModulosVisibles(res.data.modulos_visibles || []);
      setPermisosModulo(res.data.permisos_modulo || {});
    });
  }, [empleadoId]);

  // ---------------------------------------------------------
  // MARCAR / DESMARCAR MÓDULO
  // ---------------------------------------------------------
  const toggleModulo = (modulo) => {
    let nuevosModulos = [...modulosVisibles];

    if (nuevosModulos.includes(modulo)) {
      nuevosModulos = nuevosModulos.filter((m) => m !== modulo);
    } else {
      nuevosModulos.push(modulo);
    }

    setModulosVisibles(nuevosModulos);
  };

  // ---------------------------------------------------------
  // MARCAR / DESMARCAR PERMISO DE UN MÓDULO
  // ---------------------------------------------------------
  const togglePermiso = (modulo, permiso) => {
    const permisosActuales = permisosModulo[modulo] || [];
    let nuevosPermisos = [...permisosActuales];

    if (nuevosPermisos.includes(permiso)) {
      nuevosPermisos = nuevosPermisos.filter((p) => p !== permiso);
    } else {
      nuevosPermisos.push(permiso);
    }

    setPermisosModulo({
      ...permisosModulo,
      [modulo]: nuevosPermisos,
    });
  };

  // ---------------------------------------------------------
  // GUARDAR CAMBIOS
  // ---------------------------------------------------------
  const guardarCambios = () => {
    axios
      .put(`${API}/empleados/${empleadoId}/permisos`, {
        modulos_visibles: modulosVisibles,
        permisos_modulo: permisosModulo,
      })
      .then(() => {
        alert("Permisos actualizados correctamente");
      })
      .catch(() => {
        alert("Error al guardar permisos");
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Permisos por módulo</h2>

      {/* MÓDULOS VISIBLES */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Módulos visibles</h3>

        <div className="grid grid-cols-2 gap-3">
          {modulosDisponibles.map((modulo) => (
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
              {permisosDisponibles.map((permiso) => (
                <label key={permiso} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      permisosModulo[modulo]?.includes(permiso) || false
                    }
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
