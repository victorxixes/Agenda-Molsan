import { useEffect, useState } from "react";
import {
  obtenerFichaCompleta,
  actualizarModulosVisibles,
  actualizarPermisosModulo,
  subirFotoEmpleado,
} from "../../api/empleados";

export default function EmpleadoFicha({ empleadoId }) {
  const [data, setData] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [permisos, setPermisos] = useState({});

  useEffect(() => {
    if (!empleadoId) return;
    obtenerFichaCompleta(empleadoId).then((res) => {
      setData(res.data);
      setModulos(res.data.modulos_visibles || []);
      setPermisos(res.data.permisos_modulo || {});
    });
  }, [empleadoId]);

  if (!empleadoId) return <div>Selecciona un empleado.</div>;
  if (!data) return <div>Cargando ficha...</div>;

  const { empleado, rol } = {
    empleado: data.empleado,
    rol: data.empleado.rol,
  };

  const handleFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await subirFotoEmpleado(empleado.id, file);
    const res = await obtenerFichaCompleta(empleado.id);
    setData(res.data);
  };

  const guardarModulos = async () => {
    await actualizarModulosVisibles(empleado.id, modulos);
  };

  const guardarPermisos = async () => {
    await actualizarPermisosModulo(empleado.id, permisos);
  };

  return (
    <div className="space-y-6">
      {/* Datos básicos */}
      <section className="border p-4 rounded bg-white shadow">
        <h2 className="text-lg font-semibold mb-3">
          Datos básicos
        </h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><strong>Nombre:</strong> {empleado.nombre}</div>
          <div><strong>Apellidos:</strong> {empleado.apellidos}</div>
          <div><strong>DNI:</strong> {empleado.dni}</div>
          <div><strong>Teléfono:</strong> {empleado.telefono}</div>
          <div><strong>Email personal:</strong> {empleado.email_personal}</div>
          <div><strong>Email empresa:</strong> {empleado.email_empresa}</div>
          <div><strong>Usuario:</strong> {empleado.usuario}</div>
          <div><strong>Rol:</strong> {rol?.nombre}</div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          {empleado.foto && (
            <img
              src={empleado.foto}
              alt="Foto empleado"
              className="w-24 h-24 rounded object-cover border"
            />
          )}
          <label className="text-sm">
            Subir nueva foto:
            <input
              type="file"
              className="block mt-1"
              onChange={handleFoto}
            />
          </label>
        </div>
      </section>

      {/* Seguridad: módulos visibles */}
      <section className="border p-4 rounded bg-white shadow">
        <h2 className="text-lg font-semibold mb-3">
          Módulos visibles
        </h2>
        <textarea
          className="w-full border rounded p-2 text-xs"
          rows={4}
          value={JSON.stringify(modulos, null, 2)}
          onChange={(e) => {
            try {
              setModulos(JSON.parse(e.target.value));
            } catch {
              // ignorar parse error
            }
          }}
        />
        <button
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
          onClick={guardarModulos}
        >
          Guardar módulos visibles
        </button>
      </section>

      {/* Seguridad: permisos por módulo */}
      <section className="border p-4 rounded bg-white shadow">
        <h2 className="text-lg font-semibold mb-3">
          Permisos por módulo
        </h2>
        <textarea
          className="w-full border rounded p-2 text-xs"
          rows={6}
          value={JSON.stringify(permisos, null, 2)}
          onChange={(e) => {
            try {
              setPermisos(JSON.parse(e.target.value));
            } catch {
              // ignorar
            }
          }}
        />
        <button
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
          onClick={guardarPermisos}
        >
          Guardar permisos
        </button>
      </section>
    </div>
  );
}
