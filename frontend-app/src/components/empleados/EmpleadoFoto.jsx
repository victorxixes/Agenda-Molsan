import { useState } from "react";
import GlassCard from "../ui/GlassCard";
import { useEmpleadosStore } from "../../store/empleadosStore";

const getFotoURL = (foto) => {
  if (!foto || foto.trim() === "") {
    return `${import.meta.env.VITE_API_URL}/fotos/default-avatar.png`;
  }

  // Si la BD guarda "empleado_1.jpg"
  return `${import.meta.env.VITE_API_URL}/fotos/${foto}`;
};


export default function EmpleadoFoto({ empleado }) {
  const [archivo, setArchivo] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);

  const { subirFoto, cargarEmpleado } = useEmpleadosStore();

  const handleUpload = async () => {
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen");
      return;
    }

    setSubiendo(true);
    setError(null);

    try {
      await subirFoto(empleado.id, archivo);
      await cargarEmpleado(empleado.id);
    } catch {
      setError("Error subiendo la foto");
    }

    setSubiendo(false);
    setArchivo(null);
  };

  return (
    <GlassCard className="p-4 space-y-4">
      <h3 className="text-xl font-bold text-[#1F3A5F]">Foto del empleado</h3>

      <img
        src={getFotoURL(empleado.foto)}
        alt="Foto empleado"
        className="w-40 h-40 rounded-lg object-cover border"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setArchivo(e.target.files[0])}
        className="input"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        className="btn-primary w-full"
        onClick={handleUpload}
        disabled={subiendo}
      >
        {subiendo ? "Subiendo..." : "Subir foto"}
      </button>
    </GlassCard>
  );
}
