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
    <div className="space-y-4">
      {/* BUSCADOR */}
      <div className="flex gap-2">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Buscar por nombre o DNI"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="border p-2 rounded"
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

      {/* TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {empleados.map((e) => (
          <div
            key={e.id}
            className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md cursor-pointer transition"
            onClick={() => onSeleccionar?.(e.id)}
          >
            {/* FOTO */}
            <div className="flex items-center gap-3">
              <img
                src={
                  e.foto
                    ? `${API_BASE}${e.foto}`
                    : "/no-foto.png"
                }
                alt="foto"
                className="w-16 h-16 rounded-full object-cover border"
              />

              <div>
                <div className="font-semibold text-gray-900 text-sm">
                  {e.nombre} {e.apellidos}
                </div>
                <div className="text-xs text-gray-600">
                  ID: {e.id}
                </div>
              </div>
            </div>

            {/* INFO */}
            <div className="mt-3 text-xs text-gray-700 space-y-1">
              <div><strong>Tel:</strong> {e.telefono || "-"}</div>
              <div><strong>Email:</strong> {e.email_empresa || "-"}</div>
              <div><strong>Departamento:</strong> {e.departamento_nombre || "-"}</div>
              <div><strong>Sección:</strong> {e.seccion_nombre || "-"}</div>
              <div><strong>Cargo:</strong> {e.cargo_nombre || "-"}</div>
            </div>

            {/* ESTADO */}
            <div className="mt-3">
              {e.activo ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                  Activo
                </span>
              ) : (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
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
