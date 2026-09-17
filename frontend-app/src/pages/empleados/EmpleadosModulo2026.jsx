import { useState, useCallback } from "react";
import EmpleadosListado from "./EmpleadosListado";
import ModalEmpleado from "../../components/empleados/ModalEmpleado";

export default function EmpleadosModulo2026() {
  const [seleccionado, setSeleccionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const abrirFicha = useCallback((id) => {
    const idNum = Number(id);

    // 🔥 Blindar ID: solo abrir modal si es un número válido
    if (!Number.isFinite(idNum)) return;

    setSeleccionado(idNum);
    setModalOpen(true);
  }, []);

  const cerrarModal = useCallback(() => {
    setModalOpen(false);
    setSeleccionado(null);
  }, []);

  return (
    <div className="p-6 space-y-6 text-white animate-fade-in">

      {/* CABECERA PREMIUM */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl
          p-6 shadow-xl
        "
      >
        <h1 className="text-3xl font-bold drop-shadow">Empleados</h1>
        <p className="text-white/70">Gestión de empleados SJ‑2026.</p>
      </div>

      {/* LISTADO PREMIUM */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl
          p-4 shadow-xl
        "
      >
        <EmpleadosListado onSeleccionar={abrirFicha} />
      </div>

      {/* MODAL PREMIUM */}
      {modalOpen && Number.isFinite(seleccionado) && (
        <ModalEmpleado
          open={modalOpen}
          onClose={cerrarModal}
          empleadoId={seleccionado}
        />
      )}
    </div>
  );
}
