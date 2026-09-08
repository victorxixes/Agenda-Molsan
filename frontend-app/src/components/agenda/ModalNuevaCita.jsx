import { useEffect, useState } from "react";
import { useNotariasStore } from "../../store/notariasStore";
import { useEmpleadosStore } from "../../store/empleadosStore";

const TIPOS_CITA = ["Firma notarial", "Reunión", "Otros"];

export default function ModalNuevaCita({
  fecha,
  modo = "crear",
  cita = null,
  onClose,
  onGuardar,
  onDelete,
}) {
  const [horaInicio, setHoraInicio] = useState("10:00");
  const [horaFin, setHoraFin] = useState("11:00");
  const [tipoCita, setTipoCita] = useState("Firma notarial");

  const [notariaBusqueda, setNotariaBusqueda] = useState("");
  const [notariaSeleccionada, setNotariaSeleccionada] = useState(null);

  const [tipoFirma, setTipoFirma] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [apoderadoCTN, setApoderadoCTN] = useState("");
  const [apoderadoSuplente, setApoderadoSuplente] = useState("");

  const [apoderadoOtorgante, setApoderadoOtorgante] = useState("");

  // Stores
  const { notarias, cargarNotarias } = useNotariasStore();
  const { apoderados, cargarApoderados } = useEmpleadosStore();

  // Cargar datos de edición
  useEffect(() => {
    if (modo === "editar" && cita) {
      setHoraInicio(cita.hora_inicio || "10:00");
      setHoraFin(cita.hora_fin || "11:00");
      setTipoCita(cita.tipo_cita || "Firma notarial");

      setTipoFirma(cita.tipo_firma || "");
      setObservaciones(cita.observaciones || "");

      setApoderadoCTN(cita.apoderado_id || "");
      setApoderadoSuplente(cita.apoderado_s || "");

      setApoderadoOtorgante(cita.apoderado_otorgante || "");

      setNotariaSeleccionada(cita.notaria || null);
    }
  }, [modo, cita]);

  // Cargar datos iniciales
  useEffect(() => {
    cargarNotarias();
    cargarApoderados();
  }, []);

  // Fallback de carga
  if (!Array.isArray(notarias) || notarias.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6">
          <p className="text-center text-gray-600">Cargando datos…</p>
        </div>
      </div>
    );
  }

  const handleGuardar = () => {
    const payload = {
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      tipo_cita: tipoCita,

      notaria_id: notariaSeleccionada?.id || null,

      tipo_firma: tipoFirma || "",
      observaciones: observaciones || "",

      apoderado_id: apoderadoCTN || null,
      apoderado_s: apoderadoSuplente || "",
      apoderado_otorgante: apoderadoOtorgante || null,
    };

    onGuardar(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6">

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">
              {modo === "crear" ? "Nueva cita" : "Editar cita"}
            </h2>
            <p className="text-sm text-gray-500">{fecha}</p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Columna izquierda */}
          <div className="space-y-3">

            <label className="text-sm font-medium">Hora inicio</label>
            <input
              type="time"
              className="sj-input"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
            />

            <label className="text-sm font-medium">Hora fin</label>
            <input
              type="time"
              className="sj-input"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
            />

            <label className="text-sm font-medium">Tipo de cita</label>
            <select
              className="sj-input"
              value={tipoCita}
              onChange={(e) => setTipoCita(e.target.value)}
            >
              {TIPOS_CITA.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <label className="text-sm font-medium">Apoderado Otorgante</label>
            <select
              className="sj-input"
              value={apoderadoOtorgante}
              onChange={(e) => setApoderadoOtorgante(e.target.value)}
            >
              <option value="">Seleccionar apoderado</option>
              {apoderados.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre} {a.apellidos}
                </option>
              ))}
            </select>
          </div>

          {/* Columna derecha */}
          <div className="space-y-3">

            <label className="text-sm font-medium">Buscar notaría</label>
            <input
              type="text"
              className="sj-input"
              value={notariaBusqueda}
              onChange={(e) => setNotariaBusqueda(e.target.value)}
              placeholder="Buscar notaría..."
            />

            <div className="max-h-32 overflow-y-auto border rounded">
              {notarias
                .filter((n) =>
                  n.nombre.toLowerCase().includes(notariaBusqueda.toLowerCase())
                )
                .map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setNotariaSeleccionada(n);
                      setTipoFirma(n.vc || "");
                      setObservaciones(n.observacion || "");
                      setApoderadoCTN(n.apoderado_id || "");
                      setApoderadoSuplente(n.apoderado_s || "");
                    }}
                    className={`cursor-pointer p-2 border-b text-sm hover:bg-blue-50 ${
                      notariaSeleccionada?.id === n.id ? "bg-blue-100" : ""
                    }`}
                  >
                    {n.nombre}
                  </div>
                ))}
            </div>

            <label className="text-sm font-medium">Tipo firma</label>
            <input
              className="sj-input"
              value={tipoFirma}
              onChange={(e) => setTipoFirma(e.target.value)}
            />

            <label className="text-sm font-medium">Apoderado CTN</label>
            <input
              className="sj-input"
              value={apoderadoCTN}
              onChange={(e) => setApoderadoCTN(e.target.value)}
            />

            <label className="text-sm font-medium">Apoderado suplente</label>
            <input
              className="sj-input"
              value={apoderadoSuplente}
              onChange={(e) => setApoderadoSuplente(e.target.value)}
            />

            <label className="text-sm font-medium">Observaciones</label>
            <textarea
              rows={4}
              className="sj-input"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {modo === "editar" && onDelete && (
            <button
              onClick={onDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Eliminar
            </button>
          )}

          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancelar
          </button>

          <button
            onClick={handleGuardar}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {modo === "crear" ? "Guardar cita" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
