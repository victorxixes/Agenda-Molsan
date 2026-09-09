import { useState } from "react";
import EmpleadosListado from "./EmpleadosListado";
import ModalEmpleado from "../../components/empleados/ModalEmpleado";

export default function EmpleadosModulo2026() {
  const [seleccionado, setSeleccionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const abrirFicha = (id) => {
    setSeleccionado(id);     // primero asignas el ID
    setModalOpen(true);      // luego abres el modal
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Empleados 2026</h1>

      <EmpleadosListado
        onSeleccionar={(id) => abrirFicha(id)}
      />

      {modalOpen && seleccionado && (
        <ModalEmpleado
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          empleadoId={seleccionado}
        />
      )}
    </div>
  );
}
