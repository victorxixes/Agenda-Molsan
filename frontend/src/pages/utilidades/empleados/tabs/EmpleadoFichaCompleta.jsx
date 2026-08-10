import React, { useEffect, useState } from "react";
import DatosPersonales from "./DatosPersonales";
import DatosLaborales from "./DatosLaborales";
import RolEmpleado from "./RolEmpleado";
import ModulosEmpleado from "./ModulosEmpleado";
import PermisosEmpleado from "./PermisosEmpleado";
import AuditoriaEmpleado from "./AuditoriaEmpleado";
import EmpleadoEditarCompleto from "./EmpleadoEditarCompleto";

export default function EmpleadoFichaCompleta({ empleadoId }) {
  const [empleado, setEmpleado] = useState(null);
  const [tab, setTab] = useState("resumen");
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  const cargarEmpleado = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/empleados/${empleadoId}`);
    const data = await res.json();
    setEmpleado(data);
    setEditData(data);
    setLoading(false);
  };

  const toggleEstado = async () => {
    const url = empleado.activo
      ? `${import.meta.env.VITE_API_URL}/empleados/${empleadoId}/inhabilitar`
      : `${import.meta.env.VITE_API_URL}/empleados/${empleadoId}/habilitar`;

    await fetch(url, { method: "PUT" });
    cargarEmpleado();
  };

  useEffect(() => {
    cargarEmpleado();
  }, [empleadoId]);

  if (loading) return <p>Cargando empleado...</p>;
  if (!empleado) return <p>No encontrado</p>;

  return (
    <div className="space-y-6">

      {/* RESUMEN SUPERIOR */}
      <div className="flex items-center gap-6 p-4 bg-neutral-100 rounded-lg">
        <img
          src={empleado.foto || "/static/fotos/default.png"}
          className="w-32 h-32 rounded-lg object-cover border"
        />

        <div className="flex-1">
          <h2 className="text-2xl font-bold">
            {empleado.nombre} {empleado.apellidos}
          </h2>

          <p className="text-neutral-600">{empleado.cargo}</p>
          <p className="text-neutral-600">{empleado.departamento}</p>

          <p className="text-sm mt-1">
            Estado:{" "}
            <span className={empleado.activo ? "text-green-600" : "text-red-600"}>
              {empleado.activo ? "Activo" : "Inhabilitado"}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setTab("editar")}
          >
            Editar empleado
          </button>

          <button
            className="px-4 py-2 bg-yellow-600 text-white rounded"
            onClick={async () => {
              const nueva = prompt("Nueva contraseña:");
              if (!nueva) return;

              await fetch(
                `${import.meta.env.VITE_API_URL}/empleados/${empleadoId}/reset-password?nueva_password=${nueva}`,
                { method: "PUT" }
              );

              alert("Contraseña actualizada");
            }}
          >
            Reset password
          </button>

          <button
            className={`px-4 py-2 text-white rounded ${
              empleado.activo ? "bg-red-600" : "bg-green-600"
            }`}
            onClick={toggleEstado}
          >
            {empleado.activo ? "Inhabilitar" : "Habilitar"}
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b pb-2">
        <button onClick={() => setTab("resumen")}>Resumen</button>
        <button onClick={() => setTab("personales")}>Datos personales</button>
        <button onClick={() => setTab("laborales")}>Datos laborales</button>
        <button onClick={() => setTab("rol")}>Rol</button>
        <button onClick={() => setTab("modulos")}>Módulos</button>
        <button onClick={() => setTab("permisos")}>Permisos</button>
        <button onClick={() => setTab("auditoria")}>Auditoría</button>
        <button onClick={() => setTab("editar")}>Editar completo</button>
      </div>

      {/* CONTENIDO DE TABS */}
      {tab === "resumen" && (
        <div className="p-4 bg-white rounded shadow space-y-2">
          <h3 className="text-xl font-bold">Resumen del empleado</h3>

          <p><strong>DNI:</strong> {empleado.dni}</p>
          <p><strong>Teléfono:</strong> {empleado.telefono}</p>
          <p><strong>Email personal:</strong> {empleado.email_personal}</p>
          <p><strong>Email empresa:</strong> {empleado.email_empresa}</p>
          <p><strong>Dirección:</strong> {empleado.direccion}</p>
          <p><strong>Fecha nacimiento:</strong> {empleado.fecha_nacimiento}</p>
          <p><strong>Fecha alta:</strong> {empleado.fecha_alta}</p>
          <p><strong>Fecha baja:</strong> {empleado.fecha_baja}</p>

          <p><strong>Rol:</strong> {empleado.rol_id}</p>

          <p><strong>Módulos visibles:</strong></p>
          <ul className="list-disc ml-6">
            {(empleado.modulos_visibles || []).map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>

          <p><strong>Permisos:</strong></p>
          {empleado.permisos_modulo &&
            Object.keys(empleado.permisos_modulo).map((mod) => (
              <div key={mod}>
                <strong>{mod}:</strong> {empleado.permisos_modulo[mod].join(", ")}
              </div>
            ))}
        </div>
      )}

      {tab === "personales" && (
        <DatosPersonales formData={editData} setFormData={setEditData} />
      )}

      {tab === "laborales" && (
        <DatosLaborales formData={editData} setFormData={setEditData} />
      )}

      {tab === "rol" && (
        <RolEmpleado formData={editData} setFormData={setEditData} />
      )}

      {tab === "modulos" && (
        <ModulosEmpleado empleadoId={empleadoId} />
      )}

      {tab === "permisos" && (
        <PermisosEmpleado empleadoId={empleadoId} />
      )}

      {tab === "auditoria" && empleado.dni && (
        <AuditoriaEmpleado dni={empleado.dni} />
      )}

      {tab === "editar" && (
        <EmpleadoEditarCompleto
          empleadoId={empleadoId}
          formData={editData}
          setFormData={setEditData}
        />
      )}
    </div>
  );
}
