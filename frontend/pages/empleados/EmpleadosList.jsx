import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmpleadosStore } from "../../store/empleadosStore";

export default function EmpleadosList() {
  const navigate = useNavigate();
  const { empleados, cargarEmpleados } = useEmpleadosStore();

  useEffect(() => {
    cargarEmpleados();
  }, []);

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold text-neutral-800">Empleados</h1>
      <p className="text-neutral-600">Listado de empleados</p>

      {/* 🔥 Botón eliminado — ahora solo se crean desde Utilidades */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {empleados.map((empleado) => (
          <div
            key={empleado.id}
            className="bg-white p-4 rounded-xl border border-neutral-300 shadow-md cursor-pointer hover:bg-neutral-50"
            onClick={() => navigate(`/empleados/${empleado.id}`)}
          >
            <h3 className="font-semibold text-neutral-800">
              {empleado.nombre}
            </h3>
            <p className="text-neutral-600 text-sm">{empleado.rol}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
