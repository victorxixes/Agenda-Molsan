import { useEffect, useState, useCallback } from "react";
import { API_BASE } from "../../api/config";
import {
  obtenerFichaCompleta,
  editarEmpleado,
  subirFotoEmpleado,
} from "../../api/empleados";

export default function EmpleadoPerfil({ id }) {
  // Blindar ID
  const idNum = Number(id);
  const idValido = Number.isFinite(idNum) && idNum > 0;

  const [data, setData] = useState(null);
  const [empleadoEdit, setEmpleadoEdit] = useState({});
  const [fotoPreview, setFotoPreview] = useState(null);
  const [tab, setTab] = useState("basicos");

  // Si el ID no es válido, no montar nada
  if (!idValido) {
    return (
      <div className="text-white/70 p-6">
        Selecciona un empleado válido.
      </div>
    );
  }

  // Cargar ficha completa
  useEffect(() => {
    obtenerFichaCompleta(idNum).then((res) => {
      const d = res.data || {};
      setData(d);
      setEmpleadoEdit(d.empleado || {});
    });
  }, [idNum]);

  if (!data) {
    return (
      <div className="text-white/70 animate-pulse p-6">
        Cargando perfil…
      </div>
    );
  }

  const empleado = empleadoEdit || {};

  // Cambiar campos
  const handleChange = useCallback((field, value) => {
    setEmpleadoEdit((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Guardar cambios
  const guardarCambios = useCallback(async () => {
    try {
      await editarEmpleado(idNum, empleadoEdit);
      alert("Cambios guardados correctamente");

      const res = await obtenerFichaCompleta(idNum);
      setData(res.data);
      setEmpleadoEdit(res.data.empleado);
    } catch (err) {
      console.error(err);
      alert("Error al guardar los cambios");
    }
  }, [idNum, empleadoEdit]);

  // Subir foto
  const handleFoto = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setFotoPreview(URL.createObjectURL(file));

      await subirFotoEmpleado(idNum, file);
      const res = await obtenerFichaCompleta(idNum);
      setData(res.data);
      setEmpleadoEdit(res.data.empleado);
    },
    [idNum]
  );

  return (
    <div className="space-y-8 text-white animate-fade-in">
      {/* TABS PREMIUM */}
      <div className="flex gap-6 border-b border-white/20 pb-3">
        {["basicos", "personales", "laborales", "auditoria"].map((t) => (
          <button
            key={t}
            className={`
              pb-2 transition-all duration-300
              ${
                tab === t
                  ? "text-blue-300 font-semibold border-b-2 border-blue-400 scale-[1.05]"
                  : "text-white/60 hover:text-white"
              }
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

      ============================
          DATOS BÁSICOS
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
            {[
              ["nombre", "Nombre"],
              ["apellidos", "Apellidos"],
              ["dni", "DNI"],
              ["telefono", "Teléfono"],
              ["email_personal", "Email personal"],
              ["email_empresa", "Email empresa"],
              ["usuario", "Usuario"],
            ].map(([campo, label]) => (
              <div key={campo}>
                <strong className="text-white/80">{label}:</strong>
                <input
                  className="
                    w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                    text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                    transition-all duration-300
                  "
                  value={empleado[campo] || ""}
                  onChange={(e) => handleChange(campo, e.target.value)}
                />
              </div>
            ))}

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
                  shadow-xl transition-all duration-300 hover:scale-[1.03]
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
              text-white shadow-lg transition active:scale-[0.97]
            "
            onClick={guardarCambios}
          >
            Guardar cambios
          </button>
        </section>
      )}

      {/* ============================
          DATOS PERSONALES
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
            {[
              ["direccion", "Dirección"],
              ["codigo_postal", "Código postal"],
              ["poblacion", "Población"],
              ["provincia", "Provincia"],
              ["fecha_nacimiento", "Fecha nacimiento", "date"],
              ["alergias", "Alergias"],
              ["persona_contacto", "Persona contacto"],
              ["telefono_contacto", "Teléfono contacto"],
            ].map(([campo, label, tipo]) => (
              <div key={campo}>
                <strong className="text-white/80">{label}:</strong>
                <input
                  type={tipo || "text"}
                  className="
                    w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                    text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                    transition-all duration-300
                  "
                  value={empleado[campo] || ""}
                  onChange={(e) => handleChange(campo, e.target.value)}
                />
              </div>
            ))}

            <div className="col-span-2">
              <strong className="text-white/80">Observaciones:</strong>
              <textarea
                className="
                  w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                  text-white text-sm focus:ring-2 focus:ring-blue-400
                  scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
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
              text-white shadow-lg transition active:scale-[0.97]
            "
            onClick={guardarCambios}
          >
            Guardar cambios
          </button>
        </section>
      )}

      {/* ============================
          DATOS LABORALES
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
            {[
              ["departamento_id", "Departamento ID"],
              ["seccion_id", "Sección ID"],
              ["cargo_id", "Cargo ID"],
              ["fecha_alta", "Fecha alta", "date"],
              ["fecha_baja", "Fecha baja", "date"],
            ].map(([campo, label, tipo]) => (
              <div key={campo}>
                <strong className="text-white/80">{label}:</strong>
                <input
                  type={tipo || "text"}
                  className="
                    w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
                    text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
                    transition-all duration-300
                  "
                  value={empleado[campo] || ""}
                  onChange={(e) => handleChange(campo, e.target.value)}
                />
              </div>
            ))}

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
              text-white shadow-lg transition active:scale-[0.97]
            "
            onClick={guardarCambios}
          >
            Guardar cambios
          </button>
        </section>
      )}

      {/* ============================
          AUDITORÍA
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
                  shadow-md backdrop-blur-md transition-all duration-300
                  hover:scale-[1.01]
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
