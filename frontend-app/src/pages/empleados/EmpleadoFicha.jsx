import { useEffect, useState } from "react";
import { API_BASE } from "../../api/config";
import axios from "axios";

import ModalEmpleado from "../../components/empleados/ModalEmpleado";

export default function EmpleadoFicha({ empleadoId }) {
  const [empleado, setEmpleado] = useState(null);
  const [auditoria, setAuditoria] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!empleadoId) return;

    const cargar = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/empleados/${empleadoId}/ficha`);
        setEmpleado(res.data.empleado || null);
        setAuditoria(res.data.auditoria || []);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [empleadoId]);

  if (!empleadoId) {
    return (
      <div className="p-6 text-white">
        No se ha seleccionado ningún empleado.
      </div>
    );
  }

  if (loading || !empleado) {
    return (
      <div className="p-6 text-white animate-pulse">
        Cargando ficha del empleado…
      </div>
    );
  }
  return (
    <>
      {/* MODAL */}
      {openModal && (
        <ModalEmpleado
          open={openModal}
          onClose={() => setOpenModal(false)}
          empleadoId={empleadoId}
        />
      )}

      {/* FICHA */}
      <div className="p-6 text-white space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold drop-shadow">
            Ficha del empleado #{empleado.id}
          </h2>

          <button
            className="
              px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
              text-white shadow-lg transition
            "
            onClick={() => setOpenModal(true)}
          >
            Editar ficha
          </button>
        </div>

        {/* FOTO + INFO */}
        <div className="flex gap-6 items-start">

          {/* FOTO */}
          <div>
            <img
              src={
                empleado.foto_empleado
                  ? `${API_BASE}/empleados/foto/${empleado.id}`
                  : "/no-foto.png"
              }
              alt="Foto empleado"
              className="w-40 h-40 object-cover rounded-xl border border-white/20"
            />
          </div>

          {/* INFO BÁSICA */}
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-white/70">Nombre:</span>{" "}
              <strong>{empleado.nombre} {empleado.apellidos}</strong>
            </p>

            <p>
              <span className="text-white/70">Estado:</span>{" "}
              {empleado.estado === 1 ? (
                <span className="text-green-400 font-semibold">Activo</span>
              ) : (
                <span className="text-red-400 font-semibold">Baja</span>
              )}
            </p>

            <p>
              <span className="text-white/70">Teléfono:</span>{" "}
              {empleado.telefono || "—"}
            </p>

            <p>
              <span className="text-white/70">Email empresa:</span>{" "}
              {empleado.email_empresa || "—"}
            </p>

            <p>
              <span className="text-white/70">Extensión:</span>{" "}
              {empleado.extension || "—"}
            </p>
          </div>
        </div>
        {/* DATOS PERSONALES */}
        <section
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            p-6 shadow-xl space-y-4
          "
        >
          <h3 className="text-lg font-semibold drop-shadow mb-2">
            Datos personales
          </h3>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <p><span className="text-white/70">DNI:</span> {empleado.dni || "—"}</p>
            <p><span className="text-white/70">Dirección:</span> {empleado.direccion || "—"}</p>
            <p><span className="text-white/70">CP:</span> {empleado.codigo_postal || "—"}</p>
            <p><span className="text-white/70">Población:</span> {empleado.poblacion || "—"}</p>
            <p><span className="text-white/70">Provincia:</span> {empleado.provincia || "—"}</p>
            <p><span className="text-white/70">Nacimiento:</span> {empleado.fecha_nacimiento || "—"}</p>
            <p><span className="text-white/70">Alergias:</span> {empleado.alergias || "—"}</p>
            <p><span className="text-white/70">Contacto:</span> {empleado.persona_contacto || "—"}</p>
            <p><span className="text-white/70">Tel. contacto:</span> {empleado.telefono_contacto || "—"}</p>
          </div>

          <p className="text-white/70 text-sm">
            <span className="text-white">Observaciones:</span>{" "}
            {empleado.observaciones || "—"}
          </p>
        </section>

        {/* DATOS LABORALES */}
        <section
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            p-6 shadow-xl space-y-4
          "
        >
          <h3 className="text-lg font-semibold drop-shadow mb-2">
            Datos laborales
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><span className="text-white/70">Departamento:</span> {empleado.departamento || "—"}</p>
            <p><span className="text-white/70">Sección:</span> {empleado.seccion || "—"}</p>
            <p><span className="text-white/70">Cargo:</span> {empleado.cargo || "—"}</p>
            <p><span className="text-white/70">Fecha alta:</span> {empleado.fecha_alta || "—"}</p>
            <p><span className="text-white/70">Fecha baja:</span> {empleado.fecha_baja || "—"}</p>
          </div>
        </section>
        {/* AUDITORÍA */}
        <section
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            p-6 shadow-xl space-y-4
          "
        >
          <h3 className="text-lg font-semibold drop-shadow mb-2">
            Auditoría reciente
          </h3>

          {(!auditoria || auditoria.length === 0) && (
            <p className="text-white/70 text-sm">
              No hay registros de auditoría.
            </p>
          )}

          {auditoria && auditoria.length > 0 && (
            <ul className="list-disc ml-5 text-sm text-white/90 space-y-1">
              {auditoria.slice(0, 10).map((a) => (
                <li key={a.id}>
                  {new Date(a.fecha).toLocaleString("es-ES")} —{" "}
                  <strong className="text-white">{a.modulo}</strong>{" "}
                  [{a.accion}] — {a.descripcion}
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </>
  );
}
