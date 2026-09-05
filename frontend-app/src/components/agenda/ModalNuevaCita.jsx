import { useEffect, useState } from "react";
import { buscarNotarios } from "../../api/ctn";
import { listarApoderados } from "../../api/empleados";

const TIPOS_CITA = ["Firma notarial", "Reunión", "Otros"];

export default function ModalNuevaCita({
  fecha,
  onClose,
  onGuardar,
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

  const [cargandoNotarios, setCargandoNotarios] = useState(false);
  const [cargandoApoderados, setCargandoApoderados] = useState(false);

  // Cargar apoderados al abrir
  useEffect(() => {
    const cargarApoderados = async () => {
      try {
        setCargandoApoderados(true);
        const res = await listarApoderados(); // empleados con rol apoderado
        setApoderados(res.data || []);
      } catch (err) {
        console.error("Error cargando apoderados:", err);
      } finally {
        setCargandoApoderados(false);
      }
    };

    cargarApoderados();
  }, []);

  // Buscar notarios cuando cambia el texto
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!notarioBusqueda || notarioBusqueda.length < 2) {
        setNotarios([]);
        return;
      }

      try {
        setCargandoNotarios(true);
        const res = await buscarNotarios(notarioBusqueda);
        setNotarios(res.data || []);
      } catch (err) {
        console.error("Error buscando notarios:", err);
      } finally {
        setCargandoNotarios(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [notarioBusqueda]);

  // Cuando seleccionas notario, puedes derivar tipo de firma
  useEffect(() => {
    if (!notarioSeleccionado) return;
    // Ejemplo: si el notario tiene un campo tipo_firma, úsalo
    if (notarioSeleccionado.tipo_firma) {
      setTipoFirma(notarioSeleccionado.tipo_firma);
    }
  }, [notarioSeleccionado]);

  const handleGuardar = () => {
    if (!horaInicio || !horaFin || !tipoCita) return;

    const payload = {
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      tipo_cita: tipoCita,
      notario_id: notarioSeleccionado?.id || null,
      tipo_firma: tipoFirma || null,
      observaciones: observaciones || "",
      apoderado_id: apoderadoId || null,
    };

    onGuardar(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">Nueva cita</h2>
            <p className="text-sm text-gray-500">
              {fecha} · Agenda Molsan 2026
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bloque horario y tipo */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hora inicio
              </label>
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hora fin
              </label>
              <input
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de cita
              </label>
              <select
                value={tipoCita}
                onChange={(e) => setTipoCita(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
              >
                {TIPOS_CITA.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Apoderado
              </label>
              <select
                value={apoderadoId}
                onChange={(e) => setApoderadoId(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">Sin apoderado</option>
                {apoderados.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombre} {emp.apellidos}
                  </option>
                ))}
              </select>
              {cargandoApoderados && (
                <p className="text-xs text-gray-400 mt-1">
                  Cargando apoderados…
                </p>
              )}
            </div>
          </div>

          {/* Bloque notario, firma y observaciones */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notario
              </label>
              <input
                type="text"
                value={notarioBusqueda}
                onChange={(e) => setNotarioBusqueda(e.target.value)}
                placeholder="Buscar notario (CTN)…"
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
              />
              {cargandoNotarios && (
                <p className="text-xs text-gray-400 mt-1">
                  Buscando notarios…
                </p>
              )}
              {notarios.length > 0 && (
                <div className="mt-2 max-h-32 overflow-y-auto border rounded">
                  {notarios.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setNotarioSeleccionado(n)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${
                        notarioSeleccionado?.id === n.id
                          ? "bg-blue-100"
                          : ""
                      }`}
                    >
                      <div className="font-medium">
                        {n.nombre}
                      </div>
                      <div className="text-xs text-gray-500">
                        {n.poblacion} · {n.provincia}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {notarioSeleccionado && (
                <p className="mt-1 text-xs text-blue-700">
                  Notario seleccionado:{" "}
                  <span className="font-semibold">
                    {notarioSeleccionado.nombre}
                  </span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de firma
              </label>
              <input
                type="text"
                value={tipoFirma}
                onChange={(e) => setTipoFirma(e.target.value)}
                placeholder="Ej. Compra-venta, hipoteca, poderes…"
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Observaciones
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={4}
                className="mt-1 w-full border rounded px-3 py-2 text-sm resize-none"
                placeholder="Detalles de la firma, documentación, clientes, etc."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Guardar cita
          </button>
        </div>
      </div>
    </div>
  );
}
