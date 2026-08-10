import React, { useState } from "react";
import { useEmpleadosStore } from "../../store/empleadosStore";
import GlassCard from "../ui/GlassCard";

export default function EmpleadoFoto({ empleado }) {
  const { cargarEmpleado } = useEmpleadosStore();

  const [archivo, setArchivo] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);

  const subirFoto = async () => {
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen");
      return;
    }

    setSubiendo(true);
    setError(null);

    try {
      const formData = new FormData();

      // El backend requiere "data" aunque esté vacío
      formData.append("data", JSON.stringify({}));

      // Foto real
      formData.append("foto", archivo);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/empleados/editar-completo/${empleado.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Recargar empleado para obtener la nueva foto_url
        await cargarEmpleado(empleado.id);
      }
    } catch (err) {
      setError("Error subiendo la foto");
    }

    setSubiendo(false);
    setArchivo(null);
  };

  return (
    <GlassCard className="p-4 space-y-4">
      <h3 className="text-xl font-bold" style={{ color: "#1F3A5F" }}>
        Foto del empleado
      </h3>

      {empleado.foto_url ? (
        <img
          src={empleado.foto_url}
          alt="Foto empleado"
          className="w-40 h-40 rounded-lg object-cover border"
        />
      ) : (
        <p className="text-neutral-500">No hay foto asignada</p>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setArchivo(e.target.files[0])}
        className="input"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        className="btn-primary w-full"
        onClick={subirFoto}
        disabled={subiendo}
      >
        {subiendo ? "Subiendo..." : "Subir foto"}
      </button>
    </GlassCard>
  );
}
