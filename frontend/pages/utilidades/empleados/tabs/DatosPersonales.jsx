import React from "react";

export default function DatosPersonales({ formData, setFormData }) {

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-4">

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Nombre del empleado"
        />
      </div>

      {/* Apellidos */}
      <div>
        <label className="block text-sm font-medium mb-1">Apellidos</label>
        <input
          type="text"
          name="apellidos"
          value={formData.apellidos}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Apellidos del empleado"
        />
      </div>

      {/* DNI */}
      <div>
        <label className="block text-sm font-medium mb-1">DNI</label>
        <input
          type="text"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="12345678A"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-medium mb-1">Teléfono</label>
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Teléfono de contacto"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="correo@empresa.com"
        />
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-sm font-medium mb-1">Dirección</label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Calle, número, piso…"
        />
      </div>

      {/* Fecha nacimiento */}
      <div>
        <label className="block text-sm font-medium mb-1">Fecha de nacimiento</label>
        <input
          type="date"
          name="fecha_nacimiento"
          value={formData.fecha_nacimiento}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Observaciones */}
      <div>
        <label className="block text-sm font-medium mb-1">Observaciones</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows={3}
          placeholder="Notas adicionales del empleado"
        ></textarea>
      </div>

    </div>
  );
}
