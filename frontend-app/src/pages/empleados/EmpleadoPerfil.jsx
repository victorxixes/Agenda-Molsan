import { useEffect, useState } from "react";
import { API_BASE } from "../../api/config";
import {
  obtenerFichaCompleta,
  editarEmpleado,
  subirFotoEmpleado,
} from "../../api/empleados";

export default function EmpleadoPerfil({ id }) {
  const [data, setData] = useState(null);
  const [empleadoEdit, setEmpleadoEdit] = useState({});
  const [fotoPreview, setFotoPreview] = useState(null);

  const [tab, setTab] = useState("basicos");

  useEffect(() => {
    if (!id) return;
    obtenerFichaCompleta(id).then((res) => {
      setData(res.data);
      setEmpleadoEdit(res.data.empleado);
    });
  }, [id]);

  if (!data)
    return (
      <div className="text-white/70 animate-pulse p-6">
        Cargando perfil…
      </div>
    );

  const empleado = empleadoEdit;

  const handleChange = (field, value) => {
    setEmpleadoEdit((prev) => ({ ...prev, [field]: value }));
  };

  const guardarCambios = async () => {
    try {
      await editarEmpleado(empleado.id, empleadoEdit);
      alert("Cambios guardados correctamente");

      const res = await obtenerFichaCompleta(empleado.id);
      setData(res.data);
      setEmpleadoEdit(res.data.empleado);
    } catch (err) {
      console.error(err);
      alert("Error al guardar los cambios");
    }
  };

  const handleFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFotoPreview(URL.createObjectURL(file));

    await subirFotoEmpleado(empleado.id, file);
    const res = await obtenerFichaCompleta(empleado.id);
    setData(res.data);
    setEmpleadoEdit(res.data.empleado);
  };

  return (
    <div className="space-y-8 text-white">

      {/* TABS PREMIUM */}
      <div className="flex gap-6 border-b border-white/20 pb-3">
        {["basicos", "personales", "laborales", "auditoria"].map((t) => (
          <button
            key={t}
            className={`
              pb-2 transition-all
              ${tab === t
                ? "text-blue-300 font-semibold border-b-2 border-blue-400"
                : "text-white/60 hover:text-white"}
            `}
            onClick={() => setTab(t)}
          >
            {t === "basicos" && "Datos básicos"}
            {t === "personales" && "Datos personales"}
            {t === "laborales" && "Datos laborales"}
            {t === "auditoria" && "Auditoría"}
          </button>
        ))}
      </div>

      {/* ============================
          DATOS BÁSICOS (EDITABLE)
      ============================ */}
      {tab === "basicos" && (
        <section
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            p-6 shadow-xl space-y-6
          "
        >
          <h2 className="text-xl font-semibold drop-shadow mb-4">
            Datos básicos
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">

            <div>
              <strong className="text-white/80">Nombre:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.nombre || ""}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Apellidos:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.apellidos || ""}
                onChange={(e) => handleChange("apellidos", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">DNI:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.dni || ""}
                onChange={(e) => handleChange("dni", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Teléfono:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.telefono || ""}
                onChange={(e) => handleChange("telefono", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Email personal:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.email_personal || ""}
                onChange={(e) => handleChange("email_personal", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Email empresa:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.email_empresa || ""}
                onChange={(e) => handleChange("email_empresa", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Usuario:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.usuario || ""}
                onChange={(e) => handleChange("usuario", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Rol actual:</strong>
              <div className="text-white/90 mt-1">
                {empleado.rol?.nombre || "—"}
              </div>
            </div>
          </div>

          {/* FOTO */}
          <div className="mt-6 flex items-center gap-6">
            {(fotoPreview || empleado.foto) && (
              <img
                src={fotoPreview || `${API_BASE}${empleado.foto}`}
                alt="Foto empleado"
                className="
                  w-28 h-28 rounded-full object-cover border border-white/20
                  shadow-xl
                "
              />
            )}

            <label className="text-sm text-white/80">
              Subir nueva foto:
              <input
                type="file"
                className="block mt-2 text-white"
                onChange={handleFoto}
              />
            </label>
          </div>

          <button
            className="
              mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
              text-white shadow-lg transition
            "
            onClick={guardarCambios}
          >
            Guardar cambios
          </button>
        </section>
      )}

      {/* ============================
          DATOS PERSONALES (EDITABLE)
      ============================ */}
      {tab === "personales" && (
        <section
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            p-6 shadow-xl space-y-6
          "
        >
          <h2 className="text-xl font-semibold drop-shadow mb-4">
            Datos personales
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">

            <div>
              <strong className="text-white/80">Dirección:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.direccion || ""}
                onChange={(e) => handleChange("direccion", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Código postal:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.codigo_postal || ""}
                onChange={(e) => handleChange("codigo_postal", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Población:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.poblacion || ""}
                onChange={(e) => handleChange("poblacion", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Provincia:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.provincia || ""}
                onChange={(e) => handleChange("provincia", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Fecha nacimiento:</strong>
              <input
                type="date"
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white focus:ring-2 focus:ring-blue-400
                "
                value={empleado.fecha_nacimiento || ""}
                onChange={(e) => handleChange("fecha_nacimiento", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Alergias:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.alergias || ""}
                onChange={(e) => handleChange("alergias", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Persona contacto:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.persona_contacto || ""}
                onChange={(e) => handleChange("persona_contacto", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Teléfono contacto:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.telefono_contacto || ""}
                onChange={(e) => handleChange("telefono_contacto", e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <strong className="text-white/80">Observaciones:</strong>
              <textarea
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white text-sm focus:ring-2 focus:ring-blue-400
                "
                rows={3}
                value={empleado.observaciones || ""}
                onChange={(e) => handleChange("observaciones", e.target.value)}
              />
            </div>
          </div>

          <button
            className="
              mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
              text-white shadow-lg transition
            "
            onClick={guardarCambios}
          >
            Guardar cambios
          </button>
        </section>
      )}

      {/* ============================
          DATOS LABORALES (EDITABLE)
      ============================ */}
      {tab === "laborales" && (
        <section
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            p-6 shadow-xl space-y-6
          "
        >
          <h2 className="text-xl font-semibold drop-shadow mb-4">
            Datos laborales
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">

            <div>
              <strong className="text-white/80">Departamento ID:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.departamento_id || ""}
                onChange={(e) => handleChange("departamento_id", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Sección ID:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.seccion_id || ""}
                onChange={(e) => handleChange("seccion_id", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Cargo ID:</strong>
              <input
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                "
                value={empleado.cargo_id || ""}
                onChange={(e) => handleChange("cargo_id", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Fecha alta:</strong>
              <input
                type="date"
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white focus:ring-2 focus:ring-blue-400
                "
                value={empleado.fecha_alta || ""}
                onChange={(e) => handleChange("fecha_alta", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Fecha baja:</strong>
              <input
                type="date"
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white focus:ring-2 focus:ring-blue-400
                "
                value={empleado.fecha_baja || ""}
                onChange={(e) => handleChange("fecha_baja", e.target.value)}
              />
            </div>

            <div>
              <strong className="text-white/80">Activo:</strong>
              <div className="mt-1 text-white/90">
                {empleado.activo ? "Sí" : "No"}
              </div>
            </div>
          </div>

          <button
            className="
              mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
              text-white shadow-lg transition
            "
            onClick={guardarCambios}
          >
            Guardar cambios
          </button>
        </section>
      )}

      {/* ============================
          AUDITORÍA (SOLO LECTURA)
      ============================ */}
      {tab === "auditoria" && (
        <section
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            p-6 shadow-xl space-y-6
          "
        >
          <h2 className="text-xl font-semibold drop-shadow mb-4">
            Auditoría
          </h2>

          <div className="space-y-3 text-sm">
            {data.auditoria.map((item) => (
              <div
                key={item.id}
                className="
                  bg-white/5 border border-white/20 rounded-xl p-4
                  shadow-md backdrop-blur-md
                "
              >
                <div><strong className="text-white/80">Fecha:</strong> {item.fecha}</div>
                <div><strong className="text-white/80">Módulo:</strong> {item.modulo}</div>
                <div><strong className="text-white/80">Acción:</strong> {item.accion}</div>
                <div><strong className="text-white/80">Descripción:</strong> {item.descripcion}</div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
