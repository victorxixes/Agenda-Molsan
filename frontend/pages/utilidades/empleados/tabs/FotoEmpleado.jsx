import React, { useState } from "react";

export default function FotoEmpleado({ formData, setFormData }) {
  const [preview, setPreview] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Guardamos el archivo en el formData global
    setFormData({
      ...formData,
      fotoFile: file,
    });

    // Vista previa
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold mb-2">Foto del empleado</h2>
      <p className="text-sm text-gray-600 mb-4">
        Sube una fotografía del empleado. Se mostrará en el panel superior del ERP y en su ficha.
      </p>

      {/* Vista previa */}
      {preview ? (
        <div className="flex justify-center">
          <img
            src={preview}
            alt="Foto empleado"
            className="h-32 w-32 rounded-full object-cover border shadow"
          />
        </div>
      ) : (
        <p className="text-neutral-500 text-sm text-center">
          No hay foto seleccionada
        </p>
      )}

      {/* Input de archivo */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="w-full border rounded px-3 py-2 cursor-pointer"
      />

      {/* Info */}
      <p className="text-xs text-gray-500">
        Formatos permitidos: JPG, PNG. Tamaño recomendado: 300x300px.
      </p>

    </div>
  );
}
