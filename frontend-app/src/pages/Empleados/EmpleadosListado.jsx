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
    // aquí puedes recargar o aplicar cambios según tipo de evento
    if (evento.tipo === "empleado_actualizado") cargar();
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Buscar por nombre, usuario o DNI"
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

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Usuario</th>
            <th className="p-2">Teléfono</th>
            <th className="p-2">Email empresa</th>
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
              <td className="p-2">{e.id}</td>
              <td className="p-2">{e.nombre}</td>
              <td className="p-2">{e.usuario}</td>
              <td className="p-2">{e.telefono}</td>
              <td className="p-2">{e.email_empresa}</td>
              <td className="p-2">
                {e.activo ? "✅" : "❌"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
