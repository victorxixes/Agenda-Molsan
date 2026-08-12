import { useState } from "react";
import GlassCard from "../ui/GlassCard";

const getFotoURL = (foto) => {
  if (
    !foto ||
    foto === "string" ||
    foto.trim() === "" ||
    foto === null
  ) {
    return "/placeholder.png";
  }

  if (foto.startsWith("http")) {
    return foto;
  }

  return `${import.meta.env.VITE_API_URL}${foto}`;
};

export default function EmpleadoFoto({ empleado, onUploaded }) {
  const [archivo, setArchivo] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);

  const API = import.meta.env.VITE_API_URL;

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
      formData.append("archivo", archivo);

      const res = await fetch(`${API}/empleados/${empleado.id}/foto`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        onUploaded && onUploaded();
      }
    } catch (err) {
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
        onClick={subirFoto}
        disabled={subiendo}
      >
        {subiendo ? "Subiendo..." : "Subir foto"}
      </button>
    </GlassCard>
  );
}
