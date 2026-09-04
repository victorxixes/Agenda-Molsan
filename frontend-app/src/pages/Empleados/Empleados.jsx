import { useEffect } from "react";
import { useEmpleados } from "../../hooks/useEmpleados";
import { useEmpleadosWS } from "../../hooks/useEmpleadosWS";

export default function Empleados() {
  const {
    empleados,
    cargarEmpleados,
    eliminar,
  } = useEmpleados();

  useEmpleadosWS(1); // usuario actual

  useEffect(() => {
    cargarEmpleados();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Empleados</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Activo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((e) => (
            <tr key={e.id} className="border-b">
              <td>{e.id}</td>
              <td>{e.nombre}</td>
              <td>{e.usuario}</td>
              <td>{e.activo ? "Sí" : "No"}</td>
              <td>
                <button
                  className="text-red-600"
                  onClick={() => eliminar(e.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
