import { useEffect, useState } from "react";
import { buscarEmpleados } from "../../api/empleados";
import { useEmpleadosWS } from "../../hooks/useEmpleadosWS";
import { API_BASE } from "../../api/config";

export default function EmpleadosListado({ onSeleccionar }) {
  const [empleados, setEmpleados] = useState([]);
  const [q, setQ] = useState("");
  const [activo, setActivo] = useState(null);

  const cargar = () => {
    buscarEmpleados({ q: q || undefined, activo }).then((res) =>
      setEmpleados(res.data)
    );
  };

  useEffect(cargar, [q, activo]);

  useEmpleadosWS((evento) => {
    if (evento.tipo === "empleado_actualizado") cargar();
  });

  return (
    <div className="space-y-6">

      {/* BUSCADOR PREMIUM */}
      <div className="flex gap-3 bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl">
        <input
          className="
            flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white
            placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          placeholder="Buscar por nombre o DNI"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="
            bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white
            focus:ring-2 focus:ring-blue-400
          "
          value={activo ?? ""}
          onChange={(e) =>
            setActivo(
              e.target.value === ""
                ? null
                : e.target.value === "true"
            )
          }
        >
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
      </div>

      {/* TARJETAS PREMIUM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {empleados.map((e) => (
          <div
            key={e.id}
            className="
              bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5
              shadow-xl hover:shadow-2xl transition cursor-pointer
            "
            onClick={() => onSeleccionar?.(e.id)}
          >
            {/* FOTO + NOMBRE */}
            <div className="flex items-center gap-4">
              <img
                src={e.foto ? `${API_BASE}${e.foto}` : "/no-foto.png"}
                alt="foto"
                className="
                  w-16 h-16 rounded-full object-cover border border-white/20
                  shadow-md
                "
              />

              <div>
                <div className="font-semibold text-white text-lg drop-shadow">
                  {e.nombre} {e.apellidos}
                </div>
                <div className="text-xs text-white/70">
                  ID: {e.id}
                </div>
              </div>
            </div>

            {/* INFO */}
            <div className="mt-4 text-sm text-white/80 space-y-1">
              <div><strong>Tel:</strong> {e.telefono || "-"}</div>
              <div><strong>Email:</strong> {e.email_empresa || "-"}</div>
              <div><strong>Extensión:</strong> {e.extension || "-"}</div>
              <div><strong>Departamento:</strong> {e.departamento_nombre || "-"}</div>
              <div><strong>Sección:</strong> {e.seccion_nombre || "-"}</div>
              <div><strong>Cargo:</strong> {e.cargo_nombre || "-"}</div>
            </div>

            {/* ESTADO */}
            <div className="mt-4">
              {e.activo ? (
                <span className="
                  px-3 py-1 bg-green-500/20 text-green-200 border border-green-400
                  rounded-xl text-xs backdrop-blur-md
                ">
                  Activo
                </span>
              ) : (
                <span className="
                  px-3 py-1 bg-red-500/20 text-red-200 border border-red-400
                  rounded-xl text-xs backdrop-blur-md
                ">
                  Inactivo
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
