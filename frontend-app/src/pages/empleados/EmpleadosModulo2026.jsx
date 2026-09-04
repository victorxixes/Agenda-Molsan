import { useState } from "react";
import EmpleadosListado from "./EmpleadosListado";
import EmpleadoFicha from "./EmpleadoFicha";
import EmpleadoEditar from "./EmpleadoEditar";

export default function EmpleadosModulo2026() {
  const [seleccionado, setSeleccionado] = useState(null);

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Empleados 2026
        </h1>
        <EmpleadosListado onSeleccionar={setSeleccionado} />
      </div>

      <div className="space-y-4">
        <EmpleadoFicha empleadoId={seleccionado} />
        <EmpleadoEditar
          empleadoId={seleccionado}
          onGuardado={() => {
            // aquí puedes refrescar ficha o listado si quieres
          }}
        />
      </div>
    </div>
  );
}
