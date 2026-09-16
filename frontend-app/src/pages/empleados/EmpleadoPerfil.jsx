import { useEffect, useState } from "react";
import { obtenerFichaCompleta } from "../../api/empleados";
import { API_BASE } from "../../api/config";

export default function EmpleadoPerfil({ id }) {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("basicos");

  useEffect(() => {
    if (!id) return;

    obtenerFichaCompleta(id).then((res) => {
      setData(res.data);
    });
  }, [id]);

  if (!data) {
    return <div className="text-gray-500">Cargando perfil...</div>;
  }

  const empleado = data.empleado;

  return (
    <div className="space-y-6">

      {/* TÍTULO */}
      <h2 className="text-xl font-bold">
        Ficha empleado {empleado.id} — {empleado.nombre} {empleado.apellidos || ""}
      </h2>

      {/* TABS */}
      <div className="flex gap-4 border-b pb-2">
        <button className={tab === "basicos" ? "font-bold text-blue-600" : ""} onClick={() => setTab("basicos")}>
          Datos básicos
        </button>

        <button className={tab === "personales" ? "font-bold text-blue-600" : ""} onClick={() => setTab("personales")}>
          Datos personales
        </button>

        <button className={tab === "laborales" ? "font-bold text-blue-600" : ""} onClick={() => setTab("laborales")}>
          Datos laborales
        </button>

        <button className={tab === "seguridad" ? "font-bold text-blue-600" : ""} onClick={() => setTab("seguridad")}>
          Seguridad
        </button>

        <button className={tab === "auditoria" ? "font-bold text-blue-600" : ""} onClick={() => setTab("auditoria")}>
          Auditoría
        </button>
      </div>

      {/* DATOS BÁSICOS */}
      {tab === "basicos" && (
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="font-semibold">Estado:</label>
            <div>{empleado.activo ? "Activo" : "Inactivo"}</div>
          </div>

          <div>
            <label className="font-semibold">Teléfono:</label>
            <div>{empleado.telefono || "—"}</div>
          </div>

          <div>
            <label className="font-semibold">Email empresa:</label>
            <div>{empleado.email_empresa || "—"}</div>
          </div>

          <div>
            <label className="font-semibold">Extensión:</label>
            <div>{empleado.extension || "—"}</div>
          </div>

          {empleado.foto && (
            <img
              src={`${API_BASE}${empleado.foto}`}
              alt="Foto empleado"
              className="w-32 h-32 rounded-lg object-cover border"
            />
          )}
        </div>
      )}

      {/* DATOS PERSONALES */}
      {tab === "personales" && (
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="font-semibold">DNI:</label>
            <div>{empleado.dni}</div>
          </div>

          <div>
            <label className="font-semibold">Fecha nacimiento:</label>
            <div>{empleado.fecha_nacimiento || "—"}</div>
          </div>

          <div>
            <label className="font-semibold">Dirección:</label>
            <div>{empleado.direccion || "—"}</div>
          </div>

          <div>
            <label className="font-semibold">Código postal:</label>
            <div>{empleado.codigo_postal || "—"}</div>
          </div>

          <div>
            <label className="font-semibold">Población:</label>
            <div>{empleado.poblacion || "—"}</div>
          </div>

          <div>
            <label className="font-semibold">Provincia:</label>
            <div>{empleado.provincia || "—"}</div>
          </div>

          <div>
            <label className="font-semibold">Alergias:</label>
            <div>{empleado.alergias || "—"}</div>
          </div>

          <div>
            <label className="font-semibold">Persona contacto:</label>
            <div>{empleado.persona_contacto || "—"}</div>
          </div>

          <div>
            <label className="font-semibold">Teléfono contacto:</label>
            <div>{empleado.telefono_contacto || "—"}</div>
          </div>

          <div className="col-span-2">
            <label className="font-semibold">Observaciones:</label>
            <div>{empleado.observaciones || "—"}</div>
          </div>
        </div>
      )}

      {/* DATOS LABORALES */}
      {tab === "laborales" && (
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="font-semibold">Departamento ID:</label>
            <div>{empleado.departamento_id || "—"}</div>
          </div>

          <div>
            <label className="font-semibold">Sección ID:</label>
            <div>{empleado.seccion_id || "—"}</div>
          </div>

          <div>
            <label className="font-semibold">Cargo ID:</label>
            <div>{empleado.cargo_id || "—"}</div>
          </div>

          <div>
            <label className="font-semibold">Fecha alta:</label>
            <div>{empleado.fecha_alta || "—"}</div>
          </div>

          <div>
            <label className="font-semibold">Fecha baja:</label>
            <div>{empleado.fecha_baja || "—"}</div>
          </div>
        </div>
      )}

      {/* SEGURIDAD */}
      {tab === "seguridad" && (
        <div className="space-y-4">

          <div>
            <label className="font-semibold">Usuario:</label>
            <div>{empleado.usuario}</div>
          </div>

          <div>
            <label className="font-semibold">Rol:</label>
            <div>{empleado.rol || "—"}</div>
          </div>

          <div>
            <label className="font-semibold">Módulos visibles:</label>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(data.modulos_visibles, null, 2)}
            </pre>
          </div>

          <div>
            <label className="font-semibold">Permisos módulo:</label>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(data.permisos_modulo
