import { useEffect, useState } from "react";
import { useEmpleadosStore } from "../../store/empleadosStore";

const getFotoURL = (foto) => {
  if (!foto || foto.trim() === "") {
    return `${import.meta.env.VITE_API_URL}/fotos/default-avatar.png`;
  }

  // Si ya viene con /fotos/... no duplicamos la ruta
  if (foto.startsWith("/fotos/")) {
    return `${import.meta.env.VITE_API_URL}${foto}`;
  }

  // Si solo viene el nombre del archivo
  return `${import.meta.env.VITE_API_URL}/fotos/${foto}`;
};


export default function FotoEmpleado({ empleadoId }) {
  const {
    empleadoActual,
    cargarEmpleado,
    subirFoto,
  } = useEmpleadosStore();

  const [preview, setPreview] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);

  // Cargar empleado SOLO una vez
  useEffect(() => {
    cargarEmpleado(empleadoId);
  }, [empleadoId]);

  // Actualizar preview cuando llega el empleado (solo si no hay archivo local)
  useEffect(() => {
    if (empleadoActual && !archivo) {
      setPreview(getFotoURL(empleadoActual.foto));
    }
  }, [empleadoActual]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen");
      return;
    }

    setArchivo(file);
    setError(null);

    // Preview local
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!archivo) {
      setError("Selecciona una imagen primero");
      return;
    }

    setSubiendo(true);
    setError(null);

    try {
      await subirFoto(empleadoId, archivo);

      // ❌ Ya NO llamamos a cargarEmpleado
      // El store + realtime ya actualizan la ficha automáticamente

      alert("Foto actualizada correctamente");
    } catch {
      setError("Error al subir la foto");
    }

    setSubiendo(false);
    setArchivo(null);
  };

  if (!empleadoActual) return <div className="p-6">Cargando foto...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">Foto del empleado</h2>

      <div className="flex items-center gap-6">
        <img
          src={preview}
          alt="Foto empleado"
          className="w-32 h-32 rounded-full object-cover border"
        />

        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="input"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={handleUpload}
            disabled={subiendo}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {subiendo ? "Subiendo..." : "Actualizar foto"}
          </button>
        </div>
      </div>
    </div>
  );
}
