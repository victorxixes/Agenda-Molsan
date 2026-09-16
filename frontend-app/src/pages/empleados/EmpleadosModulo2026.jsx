import { useState, useCallback } from "react";
import EmpleadosListado from "./EmpleadosListado";
import ModalEmpleado from "../../components/empleados/ModalEmpleado";

/**
 * EmpleadosModulo2026 — SJ‑2026 Premium
 * - Glass‑UI
 * - Modal premium
 * - Render optimizado
 */

export default function EmpleadosModulo2026() {
  const [seleccionado, setSeleccionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const abrirFicha = useCallback((id) => {
    setSeleccionado(id);
    setModalOpen(true);
  }, []);

  const cerrarModal = useCallback(() => {
    setModalOpen(false);
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
      {modalOpen && seleccionado && (
        <ModalEmpleado
          open={modalOpen}
          onClose={cerrarModal}
          empleadoId={seleccionado}
        />
      )}
    </div>
  );
}
