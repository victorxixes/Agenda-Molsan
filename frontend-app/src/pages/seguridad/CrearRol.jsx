import { useState } from "react";
import { useSeguridadStore } from "../../store/seguridadStore";

export default function CrearRol() {
  const { crearRol } = useSeguridadStore();
  const [nombre, setNombre] = useState("");

  const guardar = async () => {
    if (!nombre.trim()) return alert("Nombre requerido");
    await crearRol({ nombre });
    setNombre("");
    alert("Rol creado");
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Crear rol</h2>

      <input
        className="input"
        placeholder="Nombre del rol"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <button className="btn-primary" onClick={guardar}>
        Guardar
      </button>
    </div>
  );
}
