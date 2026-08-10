import React from "react";

export default function DatosLaborales({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-4 bg-white rounded shadow space-y-6">

      <h3 className="text-xl font-semibold text-neutral-700">
        Datos laborales
      </h3>

      <div className="grid grid-cols-2 gap-4">

        {/* Departamento */}
        <div>
          <label className="block text-sm font-medium">Departamento</label>
          <input
            type="text"
            name="departamento"
            value={formData.departamento || ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Sección */}
        <div>
          <label className="block text-sm font-medium">Sección</label>
          <input
            type="text"
            name="seccion"
            value={formData.seccion || ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Cargo */}
        <div>
          <label className="block text-sm font-medium">Cargo</label>
          <input
            type="text"
            name="cargo"
            value={formData.cargo || ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Email empresa */}
        <div>
          <label className="block text-sm font-medium">Email empresa</label>
          <input
            type="email"
            name="email_empresa"
            value={formData.email_empresa || ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Extensión */}
        <div>
          <label className="block text-sm font-medium">Extensión</label>
          <input
            type="text"
            name="extension"
            value={formData.extension || ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Fecha alta */}
        <div>
          <label className="block text-sm font-medium">Fecha alta</label>
          <input
            type="date"
            name="fecha_alta"
            value={formData.fecha_alta || ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Fecha baja */}
        <div>
          <label className="block text-sm font-medium">Fecha baja</label>
          <input
            type="date"
            name="fecha_baja"
            value={formData.fecha_baja || ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-neutral-700">
        Otros datos
      </h3>

      <div className="grid grid-cols-2 gap-4">

        {/* Alergias */}
        <div>
          <label className="block text-sm font-medium">Alergias</label>
          <textarea
            name="alergias"
            rows={2}
            value={formData.alergias || ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Persona contacto */}
        <div>
          <label className="block text-sm font-medium">Persona contacto</label>
          <input
            type="text"
            name="persona_contacto"
            value={formData.persona_contacto || ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Teléfono contacto */}
        <div>
          <label className="block text-sm font-medium">Teléfono contacto</label>
          <input
            type="text"
            name="telefono_contacto"
            value={formData.telefono_contacto || ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium">Observaciones</label>
          <textarea
            name="observaciones"
            rows={3}
            value={formData.observaciones || ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
