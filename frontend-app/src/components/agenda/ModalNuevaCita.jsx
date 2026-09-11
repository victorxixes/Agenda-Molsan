import { useEffect, useState } from "react";
import AutocompleteNotario from "./AutocompleteNotario";

const TIPOS_CITA = ["Firma notarial", "Reunión", "Visita", "Otros"];

export default function ModalNuevaCita({
  fecha,
  modo,
  cita,
  onClose,
  onGuardar,
  onDelete,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    hora_inicio: "",
    hora_fin: "",
    tipo_cita: "",
    notario_id: null,
    tipo_firma: "",
    apoderado_id: null,
    observaciones: "",
  });

  const [notarioSeleccionado, setNotarioSeleccionado] = useState(null);

  const handleChange = (campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
  };

  // Rellenar datos si estamos editando
  useEffect(() => {
    if (modo === "editar" && cita) {
      setForm({
        hora_inicio: cita.hora_inicio,
        hora_fin: cita.hora_fin,
        tipo_cita: cita.tipo_cita,
        notario_id: cita.notario_id,
        tipo_firma: cita.tipo_firma || "",
        apoderado_id: cita.apoderado_id || null,
        observaciones: cita.observaciones || "",
      });

      if (cita.notario) {
        setNotarioSeleccionado({
          ...cita.notario,
          direccion:
            cita.notario.direccion_notaria ||
            cita.notario.direccion ||
            cita.notario.direccion_completa ||
            "",
          apoderado:
            cita.notario.apoderado ||
            cita.notario.apoderado_nombre ||
            cita.notario.apoderado_id ||
            "",
          observaciones:
            cita.notario.observaciones ||
            cita.notario.obs ||
            cita.notario.comentario ||
            "",
        });
      }
    }
  }, [modo, cita]);

  const guardar = async () => {
    setLoading(true);

    const payload = {
      fecha,
      hora_inicio: form.hora_inicio,
      hora_fin: form.hora_fin,
      tipo_cita: form.tipo_cita,
      notario_id: form.notario_id,
      tipo_firma: form.tipo_firma,
      apoderado_id: form.apoderado_id,
      observaciones: form.observaciones,
    };

    await onGuardar(payload);
    setLoading(false);
  };

  if (!fecha) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          {modo === "crear" ? "Nueva cita" : "Editar cita"} — {fecha}
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {/* Hora inicio */}
          <div>
            <label className="block mb-1 text-gray-700">Hora inicio</label>
            <input
              type="time"
              className="w-full border rounded px-2 py-1"
              value={form.hora_inicio}
              onChange={(e) => handleChange("hora_inicio", e.target.value)}
            />
          </div>

          {/* Hora fin */}
          <div>
            <label className="block mb-1 text-gray-700">Hora fin</label>
            <input
              type="time"
              className="w-full border rounded px-2 py-1"
              value={form.hora_fin}
              onChange={(e) => handleChange("hora_fin", e.target.value)}
            />
          </div>

          {/* Tipo de cita */}
          <div className="col-span-2">
            <label className="block mb-1 text-gray-700">Tipo de cita</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={form.tipo_cita}
              onChange={(e) => handleChange("tipo_cita", e.target.value)}
            >
              <option value="">Seleccionar tipo</option>
              {TIPOS_CITA.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Autocomplete Notario */}
          <div className="col-span-2">
            <label className="block mb-1 text-gray-700">Buscar notario</label>

            <AutocompleteNotario
              value={notarioSeleccionado}
              onSelect={(n) => {
                setNotarioSeleccionado(n);

                handleChange("notario_id", n.id);
                handleChange("tipo_firma", n.tipo_firma || "");
                handleChange("apoderado_id", n.apoderado || "");
                handleChange("observaciones", n.observaciones || "");
              }}
            />
          </div>

          {/* Datos del notario */}
          {notarioSeleccionado && (
            <div className="col-span-2 border rounded p-3 bg-gray-50">
              <h4 className="font-semibold text-sm mb-2">
                {notarioSeleccionado.nombre} {notarioSeleccionado.apellidos}
              </h4>

              {notarioSeleccionado.direccion && (
                <>
                  <p className="text-xs text-gray-700">
                    Dirección: {notarioSeleccionado.direccion}
                  </p>

                  <iframe
                    className="w-full h-40 mt-2 rounded"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      notarioSeleccionado.direccion
                    )}&output=embed`}
                  ></iframe>
                </>
              )}
            </div>
          )}

          {/* Tipo firma */}
          <div>
            <label className="block mb-1 text-gray-700">Firma por VC</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={form.tipo_firma}
              onChange={(e) => handleChange("tipo_firma", e.target.value)}
            />
          </div>

          {/* Apoderado */}
          <div>
            <label className="block mb-1 text-gray-700">Apoderado</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={form.apoderado_id || ""}
              onChange={(e) => handleChange("apoderado_id", e.target.value)}
            />
          </div>

          {/* Observaciones */}
          <div className="col-span-2">
            <label className="block mb-1 text-gray-700">Observaciones</label>
            <textarea
              className="w-full border rounded px-2 py-1"
              rows={3}
              value={form.observaciones}
              onChange={(e) => handleChange("observaciones", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {modo === "editar" && (
            <button
              className="px-3 py-1 bg-red-600 text-white rounded"
              onClick={onDelete}
            >
              Eliminar
            </button>
          )}

          <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>
            Cancelar
          </button>

          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={guardar}
            disabled={loading}
          >
            {modo === "crear" ? "Crear cita" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
