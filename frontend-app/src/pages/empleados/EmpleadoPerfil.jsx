import { useEffect, useState } from "react";
import { API_BASE } from "../../api/config";
import { obtenerFichaCompleta } from "../../api/empleados";

export default function EmpleadoPerfil({ id }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;
    obtenerFichaCompleta(id).then((res) => {
      setData(res.data);
    });
  }, [id]);

  if (!data) return <div>Cargando perfil...</div>;

  const empleado = data.empleado ?? {};
  const rol = empleado.rol ?? {};

  return (
    <div className="space-y-6">

      {/* Datos básicos */}
      <section className="border p-4 rounded bg-white shadow">
        <h2 className="text-lg font-semibold mb-3">Datos básicos</h2>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><strong>Nombre:</strong> {empleado.nombre}</div>
          <div><strong>Apellidos:</strong> {empleado.apellidos || "—"}</div>
          <div><strong>DNI:</strong> {empleado.dni}</div>
          <div><strong>Teléfono:</strong> {empleado.telefono || "—"}</div>
          <div><strong>Email personal:</strong> {empleado.email_personal || "—"}</div>
          <div><strong>Email empresa:</strong> {empleado.email_empresa || "—"}</div>
          <div><strong>Usuario:</strong> {empleado.usuario}</div>
          <div><strong>Rol actual:</strong> {rol?.nombre || "—"}</div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          {empleado.foto && (
            <img
              src={`${API_BASE}${empleado.foto}`}
              alt="Foto empleado"
              className="w-24 h-24 rounded object-cover border"
            />
          )}
        </div>
      </section>

      {/* Datos personales */}
      <section className="border p-4 rounded bg-white shadow">
        <h2 className="text-lg font-semibold mb-3">Datos personales</h2>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><strong>Dirección:</strong> {empleado.direccion || "—"}</div>
          <div><strong>Código postal:</strong> {empleado.codigo_postal || "—"}</div>
          <div><strong>Población:</strong> {empleado.poblacion || "—"}</div>
          <div><strong>Provincia:</strong> {empleado.provincia || "—"}</div>
          <div><strong>Fecha nacimiento:</strong> {empleado.fecha_nacimiento || "—"}</div>
          <div><strong>Alergias:</strong> {empleado.alergias || "—"}</div>
          <div><strong>Persona contacto:</strong> {empleado.persona_contacto || "—"}</div>
          <div><strong>Teléfono contacto:</strong> {empleado.telefono_contacto || "—"}</div>
        </div>

        <div className="mt-2 text-sm">
          <strong>Observaciones:</strong> {empleado.observaciones || "—"}
        </div>
      </section>

      {/* Datos laborales */}
      <section className="border p-4 rounded bg-white shadow">
        <h2 className="text-lg font-semibold mb-3">Datos laborales</h2>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><strong>Departamento ID:</strong> {empleado.departamento_id || "—"}</div>
          <div><strong>Sección ID:</strong> {empleado.seccion_id || "—"}</div>
          <div><strong>Cargo ID:</strong> {empleado.cargo_id || "—"}</div>
          <div><strong>Fecha alta:</strong> {empleado.fecha_alta || "—"}</div>
          <div><strong>Fecha baja:</strong> {empleado.fecha_baja || "—"}</div>
          <div><strong>Activo:</strong> {empleado.activo ? "Sí" : "No"}</div>
        </div>
      </section>

      {/* Seguridad */}
      <section className="border p-4 rounded bg-white shadow">
        <h2 className="text-lg font-semibold mb-3">Seguridad</h2>

        <div className="text-sm">
          <strong>Módulos visibles:</strong>
          <pre className="bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(data.modulos_visibles, null, 2)}
          </pre>
        </div>

        <div className="text-sm mt-2">
          <strong>Permisos por módulo:</strong>
          <pre className="bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(data.permisos_modulo, null, 2)}
          </pre>
        </div>
      </section>

      {/* Auditoría */}
      <section className="border p-4 rounded bg-white shadow">
        <h2 className="text-lg font-semibold mb-3">Auditoría</h2>

        <div className="space-y-2 text-sm">
          {data.auditoria.map((item) => (
            <div key={item.id} className="border rounded p-2 bg-gray-50">
              <div><strong>Fecha:</strong> {item.fecha}</div>
              <div><strong>Módulo:</strong> {item.modulo}</div>
              <div><strong>Acción:</strong> {item.accion}</div>
              <div><strong>Descripción:</strong> {item.descripcion}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
