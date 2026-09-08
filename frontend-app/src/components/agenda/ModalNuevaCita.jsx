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

  const [notarioBusqueda, setNotarioBusqueda] = useState("");
  const [notarioSeleccionado, setNotarioSeleccionado] = useState(null);

  const [tipoFirma, setTipoFirma] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [apoderadoId, setApoderadoId] = useState("");

  // ⭐ Stores blindados
  const { notarios, cargarNotarios } = useNotariasStore();
  const { apoderados, cargarApoderados } = useEmpleadosStore();

  // ⭐ Cargar datos de edición
  useEffect(() => {
    if (modo === "editar" && cita) {
      setHoraInicio(cita.hora_inicio || "10:00");
      setHoraFin(cita.hora_fin || "11:00");
      setTipoCita(cita.tipo_cita || "Firma notarial");
      setTipoFirma(cita.tipo_firma || "");
      setObservaciones(cita.observaciones || "");
      setApoderadoId(cita.apoderado_id || "");
      setNotarioSeleccionado(
        cita.notario && typeof cita.notario === "object"
          ? cita.notario
          : null
      );
    }
  }, [modo, cita]);

  // ⭐ Cargar listas desde stores
  useEffect(() => {
    cargarNotarios();
    cargarApoderados();
  }, []);

  const handleGuardar = () => {
    const payload = {
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      tipo_cita: tipoCita,
      notario_id: notarioSeleccionado?.id || null,
      tipo_firma: tipoFirma || "",
      apoderado_id: apoderadoId || null,
      observaciones: observaciones || "",
    };

    onGuardar(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6">

        {/* ... resto igual ... */}

        <div className="max-h-32 overflow-y-auto border rounded">
          {(Array.isArray(notarios) ? notarios : [])
            .filter((n) =>
              `${n.nombre} ${n.apellidos}`
                .toLowerCase()
                .includes(notarioBusqueda.toLowerCase())
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
                className={`cursor-pointer p-2 border-b text-sm hover:bg-blue-50 ${
                  notarioSeleccionado?.id === n.id ? "bg-blue-100" : ""
                }`}
              >
                {n.nombre} {n.apellidos}
              </div>
            ))}
        </div>

        {/* ... resto igual ... */}

      </div>
    </div>
  );
}
