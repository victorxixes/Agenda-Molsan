import React from "react";
import { useParams } from "react-router-dom";
import EmpleadoFichaCompleta from "../utilidades/empleados/tabs/EmpleadoFichaCompleta.jsx";

export default function EmpleadoDetalle() {
  const { id } = useParams();

  return (
    <div className="p-4">
      <EmpleadoFichaCompleta empleadoId={id} />
    </div>
  );
}
