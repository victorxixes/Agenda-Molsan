import { useEffect, useState, useCallback } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

/**
 * SeguridadRolEditor — SJ‑2026 Premium
 * - Crear / editar roles
 * - Glass‑UI
 * - Render optimizado
 */

export default function SeguridadRolEditor() {
  const { roles = [], cargarTodo } = useSeguridad();

  const [modo, setModo] = useState("lista");
  const [rolEditando, setRolEditando] = useState(null);
  const [nombreRol, setNombreRol] = useState("");

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  const iniciarCrear = useCallback(() => {
    setModo("crear");
    setNombreRol("");
  }, []);

  const iniciarEditar = useCallback((rol) => {
    setModo("editar");
    setRolEditando(rol);
    setNombreRol(rol.nombre);
  }, []);

  const cancelar = useCallback(() => {
    setModo("lista");
    setRolEditando(null);
    setNombreRol("");
  }, []);

  const guardarRol = useCallback(async () => {
    if (!nombreRol.trim()) return;

    const url = "https://agenda-intranet-b.onrender.com/api/seguridad/roles";

    if (modo === "crear") {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombreRol }),
      });
    }

    if (modo === "editar") {
      await fetch(`${url}/${rolEditando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombreRol }),
      });
    }

    await cargarTodo();
    cancelar();
  }, [nombreRol, modo, rolEditando, cargarTodo, cancelar]);

  const eliminarRol = useCallback(
    async (id) => {
      if (!confirm("¿Eliminar este rol?")) return;

      await fetch(
        `https://agenda-intranet-b.onrender.com/api/seguridad/roles/${id}`,
        { method: "DELETE" }
      );

      await cargarTodo();
    },
    [cargarTodo]
  );

  return (
    <div className="p-6 space-y-6 text-white animate-fade-in">

      <h1 className="text-3xl font-bold drop-shadow mb-4">
        Editor de Roles — SJ‑2026
      </h1>

      {/* LISTA DE ROLES */}
      {modo === "lista" && (
        <div
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            shadow-xl p-6
          "
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold drop-shadow">
              Roles existentes
            </h2>

            <button
              className="
                px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
                text-white shadow-lg transition text-sm active:scale-[0.97]
              "
              onClick={iniciarCrear}
            >
              Crear rol
            </button>
          </div>

          <table className="w-full text-sm text-white">
            <thead className="bg-white/10 border-b border-white/20">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {(roles || []).map((r) => (
                <tr
                  key={r.id}
                  className="
                    border-b border-white/10 hover:bg-white/5 transition
                  "
                >
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{r.nombre}</td>

                  <td className="p-3 space-x-2">
                    <button
                      className="
                        px-3 py-1 text-xs rounded-xl bg-purple-600/20 text-purple-200
                        hover:bg-purple-600/30 transition active:scale-[0.97]
                      "
                      onClick={() => iniciarEditar(r)}
                    >
                      Editar
                    </button>

                    <button
                      className="
                        px-3 py-1 text-xs rounded-xl bg-red-600/20 text-red-200
                        hover:bg-red-600/30 transition active:scale-[0.97]
                      "
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
        <div
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            shadow-xl p-6 space-y-4 animate-fade-in
          "
        >
          <h2 className="text-xl font-semibold drop-shadow mb-2">
            {modo === "crear"
              ? "Crear nuevo rol"
              : `Editar rol #${rolEditando.id}`}
          </h2>

          <label className="block text-sm text-white/80 mb-1">
            Nombre del rol
          </label>

          <input
            type="text"
            className="
              w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
              text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400
            "
            value={nombreRol}
            onChange={(e) => setNombreRol(e.target.value)}
          />

          <div className="flex gap-3 mt-4">
            <button
              className="
                px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700
                text-white shadow-lg transition text-sm active:scale-[0.97]
              "
              onClick={guardarRol}
            >
              Guardar
            </button>

            <button
              className="
                px-4 py-2 rounded-xl bg-gray-600/30 hover:bg-gray-600/40
                text-white shadow-lg transition text-sm active:scale-[0.97]
              "
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
