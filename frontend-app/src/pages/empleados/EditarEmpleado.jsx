import { useEffect, useState } from "react";
import axios from "axios";

export default function EditarEmpleado({ empleadoId }) {
  const [form, setForm] = useState({});
  const API = "https://agenda-intranet-backend.onrender.com";

  useEffect(() => {
    axios.get(`${API}/empleados/${empleadoId}`).then((res) => {
      setForm(res.data);
    });
  }, [empleadoId]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const guardar = () => {
    axios
      .put(`${API}/empleados/${empleadoId}`, form)
      .then(() => alert("Empleado actualizado"))
      .catch(() => alert("Error al actualizar"));
  };

  if (!form.id) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Editar empleado</h2>

      <div className="grid grid-cols-2 gap-4">
        {Object.keys(form).map((key) => (
          <div key={key}>
            <label className="font-semibold">{key}</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={form[key] || ""}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        onClick={guardar}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar cambios
      </button>
    </div>
  );
}
