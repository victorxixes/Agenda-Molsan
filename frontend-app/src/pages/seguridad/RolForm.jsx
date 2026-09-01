import { useState, useEffect } from "react";
import { useSeguridadStore } from "../../store/seguridadStore";
import { useParams, useNavigate } from "react-router-dom";

export default function RolForm() {
  const { rolActual, cargarRol, crearRol, actualizarRol } = useSeguridadStore();
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    if (id) cargarRol(id);
  }, [id]);

  useEffect(() => {
    if (rolActual && id) {
      setForm({
        nombre: rolActual.nombre,
        descripcion: rolActual.descripcion,
      });
    }
  }, [rolActual]);

  const guardar = async () => {
    if (id) {
      await actualizarRol(id, form);
    } else {
      await crearRol(form);
    }
    navigate("/seguridad/roles");
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">
        {id ? "Editar rol" : "Crear rol"}
      </h2>

      <input
        className="border p-2 rounded w-full"
        placeholder="Nombre del rol"
        value={form.nombre}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
      />

      <textarea
        className="border p-2 rounded w-full"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
      />

      <button
        onClick={guardar}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar
      </button>
    </div>
  );
}
