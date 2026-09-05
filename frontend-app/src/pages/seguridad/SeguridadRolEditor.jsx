import { useEffect, useState } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadRolEditor() {
  const { roles, cargarTodo } = useSeguridad();

  const [modo, setModo] = useState("lista"); // lista | crear | editar
  const [rolEditando, setRolEditando] = useState(null);
  const [nombreRol, setNombreRol] = useState("");

  useEffect(() => {
    cargarTodo();
  }, []);

  const iniciarCrear = () => {
    setModo("crear");
    setNombreRol("");
  };

  const iniciarEditar = (rol) => {
    setModo("editar");
    setRolEditando(rol);
    setNombreRol(rol.nombre);
  };

  const cancelar = () => {
    setModo("lista");
    setRolEditando(null);
    setNombreRol("");
  };

  const guardarRol = async () => {
    if (!nombreRol.trim()) return;

    if (modo === "crear") {
      await fetch("https://agenda-intranet-b.onrender.com/api/seguridad/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombreRol })
      });
    }

    if (modo === "editar") {
      await fetch(
        `https://agenda-intranet-b.onrender.com/api/seguridad/roles/${rolEditando.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: nombreRol })
        }
      );
    }

    await cargarTodo();
    cancelar();
  };

  const eliminarRol = async (id) => {
    if (!confirm("¿Eliminar este rol?")) return;

    await fetch(
      `https://agenda-intranet-b.onrender.com/api/seguridad/roles/${id}`,
      { method: "DELETE" }
    );

    await cargarTodo();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Editor de Roles</h1>

      {/* LISTA DE ROLES */}
      {modo === "lista" && (
        <div className="border p-4 rounded bg-white shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Roles existentes</h2>
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
              onClick={iniciarCrear}
            >
              Crear rol
            </button>
          </div>

          <table className="w-full border rounded">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Nombre</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-2">{r.id}</td>
                  <td className="p-2">{r.nombre}</td>
                  <td className="p-2 space-x-2">
                    <button
                      className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded"
                      onClick={() => iniciarEditar(r)}
                    >
                      Editar
                    </button>
                    <button
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
                      onClick={() => eliminarRol(r.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FORMULARIO CREAR / EDITAR */}
      {(modo === "crear" || modo === "editar") && (
        <div className="border p-4 rounded bg-white shadow">
          <h2 className="text-xl font-semibold mb-3">
            {modo === "crear" ? "Crear nuevo rol" : `Editar rol #${rolEditando.id}`}
          </h2>

          <label className="block text-sm font-medium mb-1">Nombre del rol</label>
          <input
            type="text"
            className="border rounded px-2 py-1 w-full"
            value={nombreRol}
            onChange={(e) => setNombreRol(e.target.value)}
          />

          <div className="flex gap-3 mt-4">
            <button
              className="px-3 py-1 bg-green-600 text-white rounded text-sm"
              onClick={guardarRol}
            >
              Guardar
            </button>

            <button
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm"
              onClick={cancelar}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
