import { useEffect, useState } from "react";
import { obtenerNotarios } from "../../api/agenda";
import { listarApoderados } from "../../api/empleados";

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

  const [notarioBusqueda, setNotarioBusqueda] = useState("");
  const [notarios, setNotarios] = useState([]);
  const [notarioSeleccionado, setNotarioSeleccionado] = useState(null);

  const [tipoFirma, setTipoFirma] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [apoderados, setApoderados] = useState([]);
  const [apoderadoId, setApoderadoId] = useState("");

  useEffect(() => {
    if (modo === "editar" && cita) {
      setHoraInicio(cita.hora_inicio);
      setHoraFin(cita.hora_fin);
      setTipoCita(cita.tipo_cita);
      setTipoFirma(cita.tipo_firma || "");
      setObservaciones(cita.observaciones || "");
      setApoderadoId(cita.apoderado_id || "");
      setNotarioSeleccionado(cita.notario || null);
    }
  }, [modo, cita]);

  useEffect(() => {
    obtenerNotarios().then((res) => setNotarios(res.data));
    listarApoderados().then((res) => setApoderados(res.data));
  }, []);

  const handleGuardar = () => {
    const payload = {
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      tipo_cita: tipoCita,
      notario_id: notarioSeleccionado?.id || null,
      tipo_firma: tipoFirma,
      apoderado_id: apoderadoId || null,
      observaciones,
    };

    onGuardar(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {modo === "crear" ? "Nueva cita" : "Editar cita"}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label>Hora inicio</label>
            <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />

            <label>Hora fin</label>
            <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />

            <label>Tipo de cita</label>
            <select value={tipoCita} onChange={(e) => setTipoCita(e.target.value)}>
              {TIPOS_CITA.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <label>Apoderado</label>
            <select value={apoderadoId} onChange={(e) => setApoderadoId(e.target.value)}>
              <option value="">Sin apoderado</option>
              {apoderados.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre} {a.apellidos}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label>Notario</label>
            <input
              type="text"
              value={notarioBusqueda}
              onChange={(e) => setNotarioBusqueda(e.target.value)}
              placeholder="Buscar notario..."
            />

            {notarios
              .filter((n) =>
                `${n.nombre} ${n.apellidos}`.toLowerCase().includes(notarioBusqueda.toLowerCase())
              )
              .map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    setNotarioSeleccionado(n);
                    setTipoFirma(n.vc || "");
                    setObservaciones(n.observacion || "");
                    setApoderadoId(n.apoderado_id || "");
                  }}
                  className="cursor-pointer p-2 border rounded hover:bg-blue-50"
                >
                  {n.nombre} {n.apellidos}
                </div>
              ))}

            <label>Tipo firma</label>
            <input value={tipoFirma} onChange={(e) => setTipoFirma(e.target.value)} />

            <label>Observaciones</label>
            <textarea
              rows={4}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {modo === "editar" && onDelete && (
            <button onClick={onDelete} className="bg-red-600 text-white px-4 py-2 rounded">
              Eliminar
            </button>
          )}

          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancelar
          </button>

          <button onClick={handleGuardar} className="px-4 py-2 bg-blue-600 text-white rounded">
            {modo === "crear" ? "Guardar cita" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
