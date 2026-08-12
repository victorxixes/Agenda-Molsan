import { useEffect, useState } from "react";
import axios from "axios";

export default function FotoEmpleado({ empleadoId }) {
  const [empleado, setEmpleado] = useState(null);
  const [preview, setPreview] = useState(null);

  const API = "https://agenda-intranet-b.onrender.com";

  useEffect(() => {
    axios.get(`${API}/empleados/${empleadoId}`).then((res) => {
      setEmpleado(res.data);
      setPreview(res.data.foto);
    });
  }, [empleadoId]);

  const subirFoto = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append("archivo", archivo);

    axios
      .post(`${API}/empleados/${empleadoId}/foto`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setPreview(res.data.foto);
        alert("Foto actualizada correctamente");
      })
      .catch(() => alert("Error al subir la foto"));
  };

  if (!empleado) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Foto del empleado</h2>

      <div className="flex items-center gap-6">
        <img
          src={preview || "/placeholder.png"}
          alt="Foto empleado"
          className="w-32 h-32 rounded-full object-cover border"
        />

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={subirFoto}
            className="mb-3"
          />
          <p className="text-sm text-gray-500">
            Selecciona una imagen para actualizar la foto del empleado.
          </p>
        </div>
      </div>
    </div>
  );
}
