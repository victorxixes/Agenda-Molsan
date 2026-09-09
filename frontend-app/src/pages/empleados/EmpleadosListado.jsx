import { useEffect, useState } from "react";
import { buscarEmpleados } from "../../api/empleados";
import { useEmpleadosWS } from "../../hooks/useEmpleadosWS";

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

      {/* TABLA */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Foto</th>
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Teléfono</th>
            <th className="p-2">Email empresa</th>
            <th className="p-2">Departamento</th>
            <th className="p-2">Sección</th>
            <th className="p-2">Cargo</th>
            <th className="p-2">Activo</th>
          </tr>
        </thead>

        <tbody>
          {empleados.map((e) => (
            <tr
              key={e.id}
              className="border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => onSeleccionar?.(e.id)}
            >
              {/* FOTO */}
              <td className="p-2">
                <img
                  src={e.foto || "/img/no-foto.png"}
                  alt="foto"
                  className="w-10 h-10 rounded-full object-cover border"
                />
              </td>

              <td className="p-2">{e.id}</td>
              <td className="p-2">{e.nombre} {e.apellidos}</td>
              <td className="p-2">{e.telefono}</td>
              <td className="p-2">{e.email_empresa}</td>

              {/* NUEVOS CAMPOS */}
              <td className="p-2">{e.departamento_nombre || "-"}</td>
              <td className="p-2">{e.seccion_nombre || "-"}</td>
              <td className="p-2">{e.cargo_nombre || "-"}</td>

              <td className="p-2">{e.activo ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
