import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmpleadosStore } from "../../store/empleadosStore";
import BuscadorEmpleados from "./BuscadorEmpleados";

const getFotoURL = (foto) => {
  if (!foto || foto === "string" || foto.trim() === "") {
    return "/placeholder.png";
  }
  if (foto.startsWith("http")) return foto;
  return `${import.meta.env.VITE_API_URL}${foto}`;
};

const EstadoBadge = ({ activo }) => (
  <span
    className={`inline-block w-3 h-3 rounded-full ${
      activo ? "bg-green-500" : "bg-red-500"
    }`}
  ></span>
);

export default function EmpleadosList() {
  const navigate = useNavigate();
  const { empleados, cargarEmpleados } = useEmpleadosStore();

  // Cargar empleados SOLO una vez al montar
  useEffect(() => {
    cargarEmpleados();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-neutral-800">Empleados</h1>
      <p className="text-neutral-600">Listado de empleados</p>

      {/* Buscador */}
      <BuscadorEmpleados />

     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {(empleados || []).map((empleado) => (
    <div
      key={empleado.id}
      className="bg-white p-4 rounded-xl border border-neutral-300 shadow-md cursor-pointer hover:bg-neutral-50"
      onClick={() => navigate(`/empleados/${empleado.id}`)}
    >
      <div className="flex items-center gap-2">
        <EstadoBadge activo={empleado.activo} />
        <h3 className="font-semibold text-neutral-800">
          {empleado.nombre} {empleado.apellidos}
        </h3>
      </div>

      <p className="text-neutral-600 text-sm">
        {empleado.rol_nombre || "Sin rol"}
      </p>

      <img
        src={getFotoURL(empleado.foto)}
        alt="Foto"
        className="w-12 h-12 rounded-full object-cover mt-2 border"
      />
    </div>
  ))}
</div>
    </div>
  );
}
